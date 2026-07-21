const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    selectExcelFile: () => ipcRenderer.invoke('select-excel-file'),
    readExcelSheets: (filePath) => ipcRenderer.invoke('read-excel-sheets', filePath),
    runTests: (options) => ipcRenderer.send('run-tests', options),
    killTests: () => ipcRenderer.send('kill-tests'),
    openReport: () => ipcRenderer.invoke('open-report'),
    installBrowsers: () => ipcRenderer.send('install-browsers'),
    getDefaults: () => ipcRenderer.invoke('get-defaults'),
    saveDefaults: (data) => ipcRenderer.invoke('save-defaults', data),
    getModules: () => ipcRenderer.invoke('get-modules'),
    
    // Listeners
    onLog: (callback) => ipcRenderer.on('test-log', (event, data) => callback(data)),
    onProgress: (callback) => ipcRenderer.on('test-progress', (event, data) => callback(data)),
    onTestFinished: (callback) => ipcRenderer.on('test-finished', (event, code) => callback(code)),
    onInstallFinished: (callback) => ipcRenderer.on('install-finished', (event, code) => callback(code))
});
