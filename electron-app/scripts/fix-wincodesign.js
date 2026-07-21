const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const cacheDir = path.join(process.env.LOCALAPPDATA, 'electron-builder', 'Cache', 'winCodeSign');
const targetDir = path.join(cacheDir, 'winCodeSign-2.6.0');

// Find the downloaded .7z file in the cache directory
if (!fs.existsSync(cacheDir)) {
    console.error(`Cache directory does not exist: ${cacheDir}`);
    process.exit(1);
}

const files = fs.readdirSync(cacheDir);
const archiveFile = files.find(f => f.endsWith('.7z'));

if (!archiveFile) {
    console.error('No .7z archive file found in the winCodeSign cache directory.');
    process.exit(1);
}

const archivePath = path.join(cacheDir, archiveFile);
console.log(`Found archive file: ${archivePath}`);

// Path to the 7za executable in node_modules
const projectDir = path.join(__dirname, '..');
const szExecutable = path.join(projectDir, 'node_modules', '7zip-bin', 'win', 'x64', '7za.exe');

if (!fs.existsSync(szExecutable)) {
    console.error(`7za.exe not found at: ${szExecutable}`);
    process.exit(1);
}

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

console.log(`Extracting ${archivePath} to ${targetDir} (excluding darwin)...`);

try {
    // Run 7zip excluding darwin folder: -x!darwin
    const command = `"${szExecutable}" x -bd -y "${archivePath}" "-o${targetDir}" -x!darwin`;
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
    console.log('Extraction completed successfully!');
} catch (e) {
    console.error('Failed to extract winCodeSign archive:', e);
    process.exit(1);
}
