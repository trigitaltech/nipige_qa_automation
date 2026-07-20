const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const XLSX = require('xlsx');

let mainWindow = null;
let activeChildProcess = null;

// Determine paths dynamically
const isPackaged = app.isPackaged;
const automationDir = isPackaged 
    ? path.join(process.resourcesPath, 'automation') 
    : path.resolve(__dirname, '..');

const nodeBin = isPackaged
    ? path.join(process.resourcesPath, 'bin', 'node.exe')
    : (fs.existsSync(path.join(__dirname, 'bin', 'node.exe')) 
        ? path.join(__dirname, 'bin', 'node.exe') 
        : 'node'); // fallback to system node in dev

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 750,
        title: "Nipige Automation Dashboard",
        icon: path.join(__dirname, 'icon.ico'), // placeholder, fallback to default if not exists
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    
    // Open devtools in development mode
    if (!isPackaged) {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC Handlers

// Excel file selection
ipcMain.handle('select-excel-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: "Select testData.xlsx file",
        filters: [{ name: 'Excel Files', extensions: ['xlsx'] }],
        properties: ['openFile']
    });
    if (canceled) return null;
    return filePaths[0];
});

// Read excel sheets
ipcMain.handle('read-excel-sheets', async (event, filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File does not exist: ${filePath}`);
        }
        const workbook = XLSX.readFile(filePath);
        const suiteSheets = [];
        
        for (const sheetName of workbook.SheetNames) {
            const ws = workbook.Sheets[sheetName];
            if (!ws) continue;
            
            // Get headers (first row of data)
            const headersRow = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];
            if (headersRow && Array.isArray(headersRow)) {
                const headers = headersRow.map(h => String(h).trim().toLowerCase());
                // A suite sheet must have both a 'testname' and 'run' column
                if (headers.includes('testname') && headers.includes('run')) {
                    suiteSheets.push(sheetName);
                }
            }
        }

        if (suiteSheets.length === 0) {
            throw new Error("No valid suite sheets found (sheets must contain 'TestName' and 'Run' columns).");
        }
        
        return suiteSheets;
    } catch (e) {
        console.error("Failed to read excel sheets", e);
        throw e;
    }
});


// Get defaults from env
ipcMain.handle('get-defaults', () => {
    const envPath = path.join(automationDir, '.env');
    const fallbackPath = path.join(automationDir, '.env.example');
    const targetPath = fs.existsSync(envPath) ? envPath : (fs.existsSync(fallbackPath) ? fallbackPath : '');

    if (!targetPath) return {};

    try {
        const envContent = fs.readFileSync(targetPath, 'utf8');
        const lines = envContent.split(/\r?\n/);
        const config = {};
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const idx = trimmed.indexOf('=');
            if (idx > 0) {
                const key = trimmed.slice(0, idx).trim();
                const value = trimmed.slice(idx + 1).trim();
                config[key] = value;
            }
        }
        return config;
    } catch (e) {
        console.error(e);
        return {};
    }
});

// Get list of available modules
ipcMain.handle('get-modules', async () => {
    try {
        const testsDir = path.join(automationDir, 'src', 'tests');
        if (!fs.existsSync(testsDir)) return [];
        
        const files = fs.readdirSync(testsDir);
        const modules = [];
        for (const file of files) {
            const fullPath = path.join(testsDir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                
                // Helper to check if folder has spec files recursively
                const hasSpecs = (dir) => {
                    const subFiles = fs.readdirSync(dir);
                    for (const sf of subFiles) {
                        const sfp = path.join(dir, sf);
                        if (fs.statSync(sfp).isDirectory()) {
                            if (hasSpecs(sfp)) return true;
                        } else if (sf.endsWith('.spec.ts')) {
                            return true;
                        }
                    }
                    return false;
                };
                
                if (hasSpecs(fullPath)) {
                    modules.push(file);
                }
            }
        }
        return modules.sort();
    } catch (e) {
        console.error("Failed to read modules list", e);
        return [];
    }
});

// Save defaults to env
ipcMain.handle('save-defaults', (event, data) => {
    const envPath = path.join(automationDir, '.env');
    try {
        let lines = [];
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const existingLines = envContent.split(/\r?\n/);
            const keysUpdated = new Set();
            for (let line of existingLines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#')) {
                    const idx = trimmed.indexOf('=');
                    if (idx > 0) {
                        const key = trimmed.slice(0, idx).trim();
                        if (data.hasOwnProperty(key)) {
                            line = `${key}=${data[key]}`;
                            keysUpdated.add(key);
                        }
                    }
                }
                lines.push(line);
            }
            for (const key in data) {
                if (!keysUpdated.has(key)) {
                    lines.push(`${key}=${data[key]}`);
                }
            }
        } else {
            for (const key in data) {
                lines.push(`${key}=${data[key]}`);
            }
        }
        fs.writeFileSync(envPath, lines.join('\n'), 'utf8');
        return true;
    } catch (e) {
        console.error("Failed to save .env file", e);
        return false;
    }
});

// Open HTML Report
ipcMain.handle('open-report', async () => {
    const reportPath = path.join(automationDir, 'test-results', 'report', 'index.html');
    if (!fs.existsSync(reportPath)) {
        throw new Error("Report not found. Please run the tests first.");
    }
    await shell.openPath(reportPath);
    return true;
});

// Kill running tests
ipcMain.on('kill-tests', () => {
    if (activeChildProcess) {
        console.log("Killing active process...");
        activeChildProcess.kill('SIGINT');
        activeChildProcess = null;
    }
});

// Clean environment variables for spawned Node processes
function getCleanEnv(customEnv = {}) {
    const env = { ...process.env, ...customEnv };
    delete env.ELECTRON_RUN_AS_NODE;
    delete env.NODE_OPTIONS;
    delete env.ELECTRON_NO_ASAR;
    return env;
}

// Run Tests orchestrator
ipcMain.on('run-tests', async (event, options) => {
    const { mode = 'suite', filePath, sheetName, moduleName, browser, headless, envUrl, workers } = options;
    
    // Clear old report before run
    const reportPath = path.join(automationDir, 'test-results', 'report');
    if (fs.existsSync(reportPath)) {
        try {
            fs.rmSync(reportPath, { recursive: true, force: true });
        } catch (e) {
            console.error("Failed to clear old report dir", e);
        }
    }

    if (mode === 'suite') {
        // Step 1: Create Suite
        sendProgress("Generating test suite from Excel...", 15);
        sendLog("=== Step 1: Generating Suite ===\n");
        sendLog(`Selected Sheet: ${sheetName}\n`);
        sendLog(`Selected Data File: ${filePath}\n`);

        const suiteEnv = getCleanEnv({
            TEST_DATA_PATH: filePath
        });

        const managerDir = path.join(automationDir, 'src', 'framework', 'manager');
        const tsNodeRegister = path.join(automationDir, 'node_modules', 'ts-node', 'register');
        const suiteScript = path.join(managerDir, 'SuiteManager.ts');

        // Execute SuiteManager.ts using ts-node with managerDir as cwd
        const suiteArgs = [
            '-r',
            tsNodeRegister,
            suiteScript,
            `SHEET=${sheetName}`
        ];

        sendLog(`Executing suite generator...\n`);
        activeChildProcess = spawn(nodeBin, suiteArgs, {
            cwd: managerDir,
            env: suiteEnv
        });

        activeChildProcess.stdout.on('data', (data) => {
            sendLog(data.toString());
        });

        activeChildProcess.stderr.on('data', (data) => {
            sendLog(`[ERROR] ${data.toString()}`);
        });

        activeChildProcess.on('close', (code) => {
            activeChildProcess = null;
            if (code !== 0) {
                sendLog(`\nSuite generation failed with exit code ${code}\n`);
                event.sender.send('test-finished', code);
                return;
            }

            sendLog("\nSuite generation completed successfully!\n\n");
            
            // Step 2: Run Playwright
            sendProgress("Running Playwright test cases...", 45);
            sendLog("=== Step 2: Running Playwright Test Suite ===\n");

            const testEnv = getCleanEnv({
                TEST_DATA_PATH: filePath,
                BROWSER: browser,
                HEADLESS: String(headless),
                BASE_URL: envUrl,
                PARALLEL_THREAD: String(workers)
            });

            const playwrightCli = path.join(automationDir, 'node_modules', '@playwright/test', 'cli.js');
            const testArgs = [
                playwrightCli,
                'test',
                '--project=suite'
            ];

            sendLog(`Running command: playwright test --project=suite\n`);
            sendLog(`Headless: ${headless} | Workers: ${workers} | Browser: ${browser}\n\n`);

            activeChildProcess = spawn(nodeBin, testArgs, {
                cwd: automationDir,
                env: testEnv
            });

            activeChildProcess.stdout.on('data', (data) => {
                sendLog(data.toString());
            });

            activeChildProcess.stderr.on('data', (data) => {
                sendLog(data.toString());
            });

            activeChildProcess.on('close', (pwCode) => {
                activeChildProcess = null;
                sendProgress("Execution finished.", 100);
                sendLog(`\nPlaywright exited with code: ${pwCode}\n`);
                event.sender.send('test-finished', pwCode);

                // Auto-open report if test completed
                if (fs.existsSync(path.join(reportPath, 'index.html'))) {
                    shell.openPath(path.join(reportPath, 'index.html'));
                }
            });
        });
    } else {
        // Module Execution Mode
        sendProgress("Running Playwright module tests...", 30);
        sendLog("=== Step 1: Running Playwright Module Suite ===\n");
        sendLog(`Selected Module: ${moduleName}\n`);
        sendLog(`Selected Data File: ${filePath}\n`);

        const testEnv = getCleanEnv({
            TEST_DATA_PATH: filePath,
            BROWSER: browser,
            HEADLESS: String(headless),
            BASE_URL: envUrl,
            PARALLEL_THREAD: String(workers)
        });

        const playwrightCli = path.join(automationDir, 'node_modules', '@playwright/test', 'cli.js');
        const modulePath = path.join('src', 'tests', moduleName);
        const testArgs = [
            playwrightCli,
            'test',
            modulePath,
            '--project=local'
        ];

        sendLog(`Running command: playwright test ${modulePath} --project=local\n`);
        sendLog(`Headless: ${headless} | Workers: ${workers} | Browser: ${browser}\n\n`);

        activeChildProcess = spawn(nodeBin, testArgs, {
            cwd: automationDir,
            env: testEnv
        });

        activeChildProcess.stdout.on('data', (data) => {
            sendLog(data.toString());
        });

        activeChildProcess.stderr.on('data', (data) => {
            sendLog(data.toString());
        });

        activeChildProcess.on('close', (pwCode) => {
            activeChildProcess = null;
            sendProgress("Execution finished.", 100);
            sendLog(`\nPlaywright exited with code: ${pwCode}\n`);
            event.sender.send('test-finished', pwCode);

            // Auto-open report if test completed
            if (fs.existsSync(path.join(reportPath, 'index.html'))) {
                shell.openPath(path.join(reportPath, 'index.html'));
            }
        });
    }
});

// Install browsers
ipcMain.on('install-browsers', (event) => {
    sendProgress("Installing Playwright browser binaries...", 10);
    sendLog("=== Playwright Browser Installer ===\n");
    sendLog("Downloading chromium, firefox, and webkit...\n");

    const playwrightCli = path.join(automationDir, 'node_modules', '@playwright/test', 'cli.js');
    const installArgs = [
        playwrightCli,
        'install'
    ];

    activeChildProcess = spawn(nodeBin, installArgs, {
        cwd: automationDir,
        env: getCleanEnv()
    });



    activeChildProcess.stdout.on('data', (data) => {
        sendLog(data.toString());
    });

    activeChildProcess.stderr.on('data', (data) => {
        sendLog(data.toString());
    });

    activeChildProcess.on('close', (code) => {
        activeChildProcess = null;
        sendProgress("Setup complete.", 100);
        sendLog(`\nBrowser installer finished with exit code ${code}\n`);
        event.sender.send('install-finished', code);
    });
});

// Helpers
function sendLog(text) {
    if (mainWindow) {
        mainWindow.webContents.send('test-log', text);
    }
}

function sendProgress(status, percent) {
    if (mainWindow) {
        mainWindow.webContents.send('test-progress', { status, percent });
    }
}
