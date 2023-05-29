const { app, BrowserWindow } = require('electron');
const { redirectConsoleLogs } = require('./logger');

const isMac = process.platform === 'darwin';

if (require('electron-squirrel-startup')) {
  app.quit();
}

const restartApp = () => {
  app.relaunch();
  app.exit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    title: "Youtube Music Wrapper",
    width: 1000,
    height: 800
  });

  mainWindow.loadURL('https://music.youtube.com');

  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log(message)
  });

  mainWindow.webContents.on('render-process-gone', (event, details) => {
    restartApp();
  });
};

process.on('uncaughtException', (err) => {
  console.error(err);
});

app.whenReady().then(() => {
  redirectConsoleLogs();
  createWindow();
});

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
