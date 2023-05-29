const path = require('path');
const { app, BrowserWindow } = require('electron');
const { redirectConsoleLogs } = require('./logger');

const isMac = process.platform === 'darwin';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    title: "Youtube Music Wrapper",
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL('https://music.youtube.com');

  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log("event", event);
    console.log("level", level);
    console.log("message", message);
  });

  mainWindow.webContents.on('render-process-gone', restartApp);

  mainWindow.webContents.openDevTools();
};

const restartApp = () => {
  app.relaunch();
  app.exit();
}

process.on('uncaughtException', (err) => {
  console.error(err);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  redirectConsoleLogs();
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
