/**
 * The main process of Electron. It is in charge of opening the main window and handling when it closes. It uses code from a few different online as I was trying to get Electron and React work with Node integration
 * @category Main
 * @module main
 * @author Victor Davidsson
 */

/* Require Electron and extract app and BrowserWindow as variables */
const { app, BrowserWindow, shell, ipcMain } = require("electron");
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS
} = require("electron-devtools-installer");

let mainWindow, loadingWindow;

const path = require("path");

const initApp = require("./initApp.js");

let loadedDetails = {},
  loadedPlugins = {};

function createLoadingWindow() {
  loadingWindow = new BrowserWindow({
    width: 400,
    height: 400,
    show: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false
    }
  });

  loadingWindow.loadFile(path.join("..", "..", "..", "public", "loading.html"));

  loadingWindow.once("ready-to-show", () => {
    loadingWindow.show();
  });
  loadingWindow.webContents.once("did-finish-load", () => {
    initApp(loadedDetails, loadedPlugins, loadingWindow.webContents).then(
      () => {
            createMainWindow();
            loadingWindow.close();
      }
    );
  });
}

/**
 * The function that will create and open the window when it's time.
 * @private
 */
function createMainWindow() {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log("An error occurred: ", err));

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false
    }
  });

  /* And load the webpage from the React webpack server, okay for development but for production. In production the app should be built and loaded straight from the file */
  let loadURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
            : path.join("..", "..", "..", "build", "index.html");
  mainWindow.loadURL(loadURL);

  /* Open the DevTools. */
  mainWindow.webContents.openDevTools();

  /* Bind events so that when the window is trying to navigate, call the functin that prevents it and opens it in an external browser instead */
  mainWindow.webContents.on("will-navigate", handleNewNavigation);
  mainWindow.webContents.on("new-window", handleNewNavigation);

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
  mainWindow.once("ready-to-show", () => {
  /* Wait until everything is ready to show. Just makes it neater. */
    mainWindow.show();
  });
}

function handleNewNavigation(e, url) {
  if (url !== e.sender.webContents.getURL()) {
    e.preventDefault();
    shell.openExternal(url);
  }
}

/* When the renderer process asks for the loaded modules, serve them to it */
ipcMain.on("request-loaded-modules", (event, arg) => {
  event.reply("serve-loaded-modules", {
    details: loadedDetails,
    plugins: loadedPlugins
  });
});

/* The scrollbar was making a hassle with the Packery grid, luckily Electron has a feature for a scrollbar that is floating. */
app.commandLine.appendSwitch("--enable-features", "OverlayScrollbar");
app.on("ready", createLoadingWindow);

/* Quit when all windows are closed. Copied from tutorial, but I think this is needed on macOS? */
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createMainWindow();
  }
});
