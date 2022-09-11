const { contextBridge } = require('electron');
const { execFile, exec } = require('child_process');


contextBridge.exposeInMainWorld('launcher', {
    execFile: execFile,
    exec: exec,
})