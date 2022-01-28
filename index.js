const electron = require('electron');
const Ffmpeg = require('fluent-ffmpeg');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
})

ipcMain.on('video:submit', async (event, path) => {

    Ffmpeg.ffprobe(path, (_, metadata) => {
        if (metadata) {
            mainWindow.webContents.send('video:metadata', metadata.format.duration);
        } else {
            mainWindow.webContents.send('video:metadata', 'FFMPEG ERROR: Cannot read file');
        }
    });
})