// Dom Elements
const tabItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

const btnBrowse = document.getElementById('btn-browse');
const excelPathInput = document.getElementById('excel-path');
const executionModeSelect = document.getElementById('execution-mode');
const browserNameSelect = document.getElementById('browser-name');
const sheetNameSelect = document.getElementById('sheet-name');
const moduleNameSelect = document.getElementById('module-name');
const groupSheet = document.getElementById('group-sheet');
const groupModule = document.getElementById('group-module');
const envUrlInput = document.getElementById('env-url');
const workerThreadsInput = document.getElementById('worker-threads');
const headlessCheckbox = document.getElementById('headless-mode');

const btnRun = document.getElementById('btn-run');
const btnCancel = document.getElementById('btn-cancel');
const btnReport = document.getElementById('btn-report');
const btnClearConsole = document.getElementById('btn-clear-console');
const consoleLogs = document.getElementById('console-logs');

const statusIndicator = document.querySelector('.status-indicator');
const statusText = document.getElementById('status-text');
const progressBar = document.getElementById('progress-bar');
const progressPercent = document.getElementById('progress-percent');

// Settings Elements
const txtTenantEmail = document.getElementById('set-tenant-email');
const txtTenantPass = document.getElementById('set-tenant-pass');
const txtAdminEmail = document.getElementById('set-admin-email');
const txtAdminPass = document.getElementById('set-admin-pass');
const txtSoapUrl = document.getElementById('set-soap-url');
const txtRestUrl = document.getElementById('set-rest-url');
const txtDbConfig = document.getElementById('set-db-config');
const btnSaveSettings = document.getElementById('btn-save-settings');
const saveStatus = document.getElementById('save-status');

// Setup Elements
const btnInstallBrowsers = document.getElementById('btn-install-browsers');
const setupProgressDetails = document.getElementById('setup-progress-details');
const setupStatusText = document.getElementById('setup-status-text');
const setupProgressBar = document.getElementById('setup-progress-bar');

// State
let selectedExcelPath = '';
let currentEnvConfig = {};

// 1. Tab Navigation
tabItems.forEach(item => {
    item.addEventListener('click', () => {
        const tabId = item.getAttribute('data-tab');
        
        tabItems.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        item.classList.add('active');
        document.getElementById(`tab-${tabId}`).classList.add('active');
    });
});

// 2. Load Defaults on Startup
async function loadDefaults() {
    try {
        currentEnvConfig = await window.api.getDefaults();
        
        // Fill Dashboard elements
        if (currentEnvConfig.BASE_URL) {
            envUrlInput.value = currentEnvConfig.BASE_URL;
        }
        if (currentEnvConfig.PARALLEL_THREAD) {
            workerThreadsInput.value = currentEnvConfig.PARALLEL_THREAD;
        }
        if (currentEnvConfig.BROWSER) {
            browserNameSelect.value = currentEnvConfig.BROWSER;
        }
        if (currentEnvConfig.TEST_DATA_PATH) {
            selectedExcelPath = currentEnvConfig.TEST_DATA_PATH;
            excelPathInput.value = currentEnvConfig.TEST_DATA_PATH;
            loadExcelSheets(selectedExcelPath);
        }

        // Fill Settings elements
        txtTenantEmail.value = currentEnvConfig.TENANT_EMAIL || '';
        txtTenantPass.value = currentEnvConfig.TENANT_PASSWORD || '';
        txtAdminEmail.value = currentEnvConfig.ADMIN_EMAIL || '';
        txtAdminPass.value = currentEnvConfig.ADMIN_PASSWORD || '';
        txtSoapUrl.value = currentEnvConfig.SOAP_API_BASE_URL || '';
        txtRestUrl.value = currentEnvConfig.REST_API_BASE_URL || '';
        txtDbConfig.value = currentEnvConfig.DB_CONFIG || '';
        
    } catch (e) {
        console.error("Failed to load settings defaults", e);
    }
}
loadDefaults();

// 2.5 Load available modules
async function loadModules() {
    try {
        const modules = await window.api.getModules();
        moduleNameSelect.innerHTML = '';
        if (modules.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.disabled = true;
            opt.selected = true;
            opt.textContent = 'No modules found';
            moduleNameSelect.appendChild(opt);
        } else {
            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.disabled = true;
            placeholder.selected = true;
            placeholder.textContent = 'Select module...';
            moduleNameSelect.appendChild(placeholder);
            
            modules.forEach(mod => {
                const opt = document.createElement('option');
                opt.value = mod.fileName;
                opt.textContent = mod.displayName;
                moduleNameSelect.appendChild(opt);
            });
        }
    } catch (e) {
        console.error("Failed to load modules", e);
    }
}
loadModules();

function updateRunButtonState() {
    const mode = executionModeSelect.value;
    const hasExcel = !!selectedExcelPath;
    
    if (mode === 'suite') {
        btnRun.disabled = !(hasExcel && sheetNameSelect.value);
    } else {
        btnRun.disabled = !(hasExcel && moduleNameSelect.value);
    }
}

// Execution Mode toggle handler
executionModeSelect.addEventListener('change', () => {
    const mode = executionModeSelect.value;
    if (mode === 'suite') {
        groupSheet.style.display = 'block';
        groupModule.style.display = 'none';
        btnRun.textContent = 'Start Suite';
    } else {
        groupSheet.style.display = 'none';
        groupModule.style.display = 'block';
        btnRun.textContent = 'Start Run';
    }
    updateRunButtonState();
});

// Helper to read excel sheets into dropdown
async function loadExcelSheets(filePath) {
    sheetNameSelect.disabled = true;
    sheetNameSelect.innerHTML = '<option value="" disabled selected>Loading sheets...</option>';
    btnRun.disabled = true;

    try {
        const sheets = await window.api.readExcelSheets(filePath);
        
        sheetNameSelect.innerHTML = '<option value="" disabled selected>Choose a sheet...</option>';
        sheets.forEach(sheet => {
            const opt = document.createElement('option');
            opt.value = sheet;
            opt.textContent = sheet;
            // Pre-select Regression, Smoke, or Sanity if found
            if (['Regression', 'Smoke', 'Sanity'].includes(sheet)) {
                opt.selected = true;
            }
            sheetNameSelect.appendChild(opt);
        });
        sheetNameSelect.disabled = false;
        updateRunButtonState();
    } catch (e) {
        sheetNameSelect.innerHTML = '<option value="" disabled selected>Error loading sheets</option>';
        console.error("Error loading excel sheets", e);
    }
}

// 3. Select Excel File & Read Sheets
btnBrowse.addEventListener('click', async () => {
    const filePath = await window.api.selectExcelFile();
    if (filePath) {
        selectedExcelPath = filePath;
        excelPathInput.value = filePath;
        await loadExcelSheets(filePath);
    }
});

sheetNameSelect.addEventListener('change', updateRunButtonState);
moduleNameSelect.addEventListener('change', updateRunButtonState);

// 4. Console log utilities
function appendLog(text) {
    consoleLogs.textContent += text;
    // Auto-scroll
    const body = consoleLogs.parentElement;
    body.scrollTop = body.scrollHeight;
}

function clearLogs() {
    consoleLogs.textContent = '';
}

btnClearConsole.addEventListener('click', clearLogs);

// 5. Test Suite Controls
btnRun.addEventListener('click', () => {
    const mode = executionModeSelect.value;
    if (mode === 'suite') {
        if (!selectedExcelPath || !sheetNameSelect.value) return;
    } else {
        if (!selectedExcelPath || !moduleNameSelect.value) return;
    }

    clearLogs();
    appendLog(`[RUNNER] Initiating ${mode === 'suite' ? 'suite' : 'module'} execution...\n`);
    
    // Toggle UI State to Running
    setRunningState(true);

    const options = {
        mode: mode,
        filePath: selectedExcelPath,
        sheetName: sheetNameSelect.value,
        moduleName: moduleNameSelect.value,
        browser: browserNameSelect.value,
        headless: headlessCheckbox.checked,
        envUrl: envUrlInput.value,
        workers: parseInt(workerThreadsInput.value, 10) || 6
    };

    window.api.runTests(options);
});

btnCancel.addEventListener('click', () => {
    appendLog(`\n[RUNNER] Sending termination signal to active process...\n`);
    window.api.killTests();
    btnCancel.disabled = true;
});

btnReport.addEventListener('click', async () => {
    try {
        await window.api.openReport();
    } catch (e) {
        alert(e.message);
    }
});

// IPC Listener Subscriptions
window.api.onLog((text) => {
    appendLog(text);
});

window.api.onProgress((data) => {
    statusText.textContent = data.status;
    progressBar.style.width = `${data.percent}%`;
    progressPercent.textContent = `${data.percent}%`;
});

window.api.onTestFinished((code) => {
    setRunningState(false);
    
    if (code === 0) {
        statusIndicator.className = "status-indicator finished-success";
        statusText.textContent = "Passed";
        appendLog(`\n[RUNNER] Tests completed successfully (Exit Code: 0).\n`);
    } else {
        statusIndicator.className = "status-indicator finished-fail";
        statusText.textContent = "Failed / Stopped";
        appendLog(`\n[RUNNER] Test run stopped or failed (Exit Code: ${code}).\n`);
    }
    
    // Enable report viewing
    btnReport.disabled = false;
});

function setRunningState(isRunning) {
    if (isRunning) {
        // Runner buttons
        btnRun.disabled = true;
        btnCancel.disabled = false;
        btnReport.disabled = true;
        
        // Disable settings adjustments
        btnBrowse.disabled = true;
        executionModeSelect.disabled = true;
        sheetNameSelect.disabled = true;
        moduleNameSelect.disabled = true;
        browserNameSelect.disabled = true;
        envUrlInput.disabled = true;
        workerThreadsInput.disabled = true;
        headlessCheckbox.disabled = true;

        // Progress Details
        statusIndicator.className = "status-indicator running";
        statusIndicator.querySelector('.dot').classList.add('pulse');
        statusText.textContent = "Initializing...";
        progressBar.style.width = "0%";
        progressPercent.textContent = "0%";
    } else {
        // Runner buttons
        btnCancel.disabled = true;

        // Re-enable settings adjustments
        btnBrowse.disabled = false;
        executionModeSelect.disabled = false;
        sheetNameSelect.disabled = false;
        moduleNameSelect.disabled = false;
        browserNameSelect.disabled = false;
        envUrlInput.disabled = false;
        workerThreadsInput.disabled = false;
        headlessCheckbox.disabled = false;
        
        statusIndicator.querySelector('.dot').classList.remove('pulse');
        
        // Restore correct run button state
        updateRunButtonState();
    }
}

// 6. Settings Operations
btnSaveSettings.addEventListener('click', async () => {
    saveStatus.className = "save-status";
    saveStatus.textContent = "Saving...";
    
    const updatedConfig = {
        ...currentEnvConfig,
        BASE_URL: envUrlInput.value,
        PARALLEL_THREAD: workerThreadsInput.value,
        BROWSER: browserNameSelect.value,
        TENANT_EMAIL: txtTenantEmail.value,
        TENANT_PASSWORD: txtTenantPass.value,
        ADMIN_EMAIL: txtAdminEmail.value,
        ADMIN_PASSWORD: txtAdminPass.value,
        SOAP_API_BASE_URL: txtSoapUrl.value,
        REST_API_BASE_URL: txtRestUrl.value,
        DB_CONFIG: txtDbConfig.value
    };

    const success = await window.api.saveDefaults(updatedConfig);
    
    if (success) {
        currentEnvConfig = updatedConfig;
        saveStatus.className = "save-status success";
        saveStatus.textContent = "Configuration saved successfully!";
        setTimeout(() => { saveStatus.textContent = ''; }, 3000);
    } else {
        saveStatus.className = "save-status error";
        saveStatus.textContent = "Failed to save configuration.";
    }
});

// 7. Installer / System Setup
btnInstallBrowsers.addEventListener('click', () => {
    btnInstallBrowsers.disabled = true;
    setupProgressDetails.style.display = 'block';
    setupStatusText.textContent = "Installing browser binaries...";
    setupProgressBar.style.width = "20%";
    
    clearLogs();
    appendLog(`[SETUP] Initializing Playwright browser binary download...\n`);
    
    // Auto shift view to dashboard tab to let user see logs
    tabItems.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    document.querySelector('[data-tab="dashboard"]').classList.add('active');
    document.getElementById('tab-dashboard').classList.add('active');

    window.api.installBrowsers();
});

window.api.onInstallFinished((code) => {
    btnInstallBrowsers.disabled = false;
    if (code === 0) {
        setupStatusText.textContent = "Installation Complete";
        setupProgressBar.style.width = "100%";
        appendLog(`\n[SETUP] Browser runtimes installed successfully (Exit Code: 0).\n`);
    } else {
        setupStatusText.textContent = "Installation Failed";
        setupProgressBar.style.width = "0%";
        appendLog(`\n[SETUP] Browser runtime setup failed (Exit Code: ${code}).\n`);
        alert(`Failed to install browsers. Please check the logs in the console.`);
    }
});
