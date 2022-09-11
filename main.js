/* eslint-env es6 */
/* eslint-disable no-console */
const { app, BrowserWindow } = require('electron');
const path = require("path");

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // sandbox: false,
            nodeIntegration: true,
            preload: path.join(__dirname, 'js/preload.js'),
        }
    })

    win.loadFile('index.html');
    win.setFullScreen(true);
    //TODO delete after development
    // win.webContents.openDevTools();
    // win.on('closed', () => {
    //     win = null
    // })
}

app.on('ready', createWindow)


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})
