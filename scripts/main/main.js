/**
  * The main process of Electron. It is in charge of opening the main window and handling when it closes.
  * @category Main
  * @module main
  * @author Victor Davidsson
  *
  */

const path = require('path');
__basedir = path.resolve(__dirname, "..", "..");

/* Require Electron and extract app and BrowserWindow as variables */
const { app, BrowserWindow } = require("electron");

let win;

/**
  * The function that will create and open the window when it's time.
  * @private
  */
function createWindow () {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    show:false,
    autoHideMenuBar: true,
    frame: false,
    backgroundColor: "#333",
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile(__basedir + "/resources/renderer/index.html");
  win.webContents.openDevTools();

  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  })

  win.once('ready-to-show', () => {
    /* Wait until everything is ready to show. Just makes it neater. */
    win.show();
  })
}

/* The scrollbar was making a hassle with the Packery grid, luckily Electron has a feature for a scrollbar that's floating. */
app.commandLine.appendSwitch('--enable-features', 'OverlayScrollbar');
app.on('ready', createWindow);

/* Quit when all windows are closed. Copied from tutorial, but I think this is needed on macOS? */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
})
