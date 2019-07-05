'use strict'

const { app, BrowserWindow } = require('electron')

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    show:false,
    autoHideMenuBar: true,
    backgroundColor: "#333",
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile('resources/index.html');
  //win.webContents.openDevTools()

  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  win.once('ready-to-show', () => {
    win.show()
  })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
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
