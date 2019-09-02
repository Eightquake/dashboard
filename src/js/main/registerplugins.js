/**
 * Reads the directory for plugins but does not try to run the code. This doesn't load any code or plugins, but adds it to an object that will be sent to the renderer process later so it knows what to import. 
 * It checks a config for trusted files and their checksum, and if a file is either not trusted or has changed it will send an IPC message to the loading window to ask the user if it trusts the file.
 * This could be done in the renderer process of the loading window, but I want to separate the views and filesystem.
 * @category Main
 * @module registerplugins
 * @author Victor Davidsson
 */

const { ipcMain } = require("electron"),
  config = require("electron-settings"),
  fs = require("fs"),
  path = require("path"),
  sha256File = require("sha256-file"),
  readPath = path.join("src", "js", "modules", "plugins", "/"),
  jsRegex = /\.jsx$/i;

let trustedPlugins = {},
  filesAskedIfTrusts = [],
  loadedPlugins,
  loadingWindowWC,
  handlerPromiseResolve;

/* The renderer process sent back a message that the user has answered if they trust a plugin */
ipcMain.on("user-plugin-trusts-answer", (event, arg) => {
  let configToSave = config.get("trusted-plugins");
  configToSave[arg.file] = { file: arg.file, checksum: arg.checksum };

  config.set("trusted-plugins", configToSave);
  trustedPlugins = configToSave;

  /* Remove the file from filesAskedIfTrusts array, as it now has been asked and gotten an answer */
  filesAskedIfTrusts.splice(filesAskedIfTrusts.indexOf(arg.file + ".jsx"), 1);

  /* If there are no more files that have been asked, try registering plugins again */
  if (filesAskedIfTrusts.length === 0) {
    readFolderForPlugins().then(() => {
      /* When readFolderForPlugins resolves, resolve the first Promise that was sent to initApp.js */
      handlerPromiseResolve();
    });
  }
});

function readFolderForPlugins() {
  return new Promise(function(resolve, reject) {
    fs.readdir(readPath, function(err, files) {
      if (err) throw err;
      /* Loop through the directory of files */
      for (let i = 0; i < files.length; i++) {
        /* Only handle files that ends in .jsx */
        if (jsRegex.test(files[i])) {
          let fileName = files[i].replace(jsRegex, "");
          /* Send a message to the renderer process that the script have started loading a file, but only use the filename without the file extension */
          loadingWindowWC.send("start-loading-file", fileName);
          /* Set maybeTrustedPlugin to the trusted plugin if it exists or undefined if not */
          let maybeTrustedPlugin = trustedPlugins[fileName] || undefined;
          /* Calculate the currentChecksum of the file that exists currently */
          let currentChecksum = sha256File(readPath + "/" + files[i]);
          if (
            maybeTrustedPlugin &&
            maybeTrustedPlugin.checksum === currentChecksum
          ) {
            /* Set the plugin as loaded, meaning the renderer process can safely import it later on */
            loadedPlugins[files[i]] = {
              type: "file",
              location: fileName
            };
            /* Send a message to the renderer process that the script have finished loading the file */
            loadingWindowWC.send("finish-loading-file", fileName);
          } else {
            /* The plugin is not set as trusted by the user! */
            loadingWindowWC.send("ask-user-trusts-file", {
              message:
                maybeTrustedPlugin &&
                maybeTrustedPlugin.checksum !== currentChecksum
                  ? "The file have changed since last trusted"
                  : "The file haven't been trusted before",
              file: fileName,
              checksum: currentChecksum
            });
            filesAskedIfTrusts.push(files[i]);
          }
        }
      }
      /* If we have loaded atleast one plugin and as many plugins as the trusted ones state, resolve this promise - else reject it. */
      if (
        Object.keys(loadedPlugins).length > 0 &&
        Object.keys(loadedPlugins).length === Object.keys(trustedPlugins).length
      ) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

function handler(loaded_plugins, loadingWindowWCArg) {
  loadedPlugins = loaded_plugins;
  /* loadingWindowWC is the webContents Object of the loadingWindow, which can be used to send messages to it */
  loadingWindowWC = loadingWindowWCArg;

  /* Set trustedPlugins as what it is stored as, but if nothing is stored save an empty object */
  if (config.has("trusted-plugins")) {
    trustedPlugins = config.get("trusted-plugins");
  } else {
    config.set("trusted-plugins", trustedPlugins);
  }

  return new Promise(function(resolve) {
    /* Save a module-scope reference of this resolve so that it can be resolved somewhere else */
    handlerPromiseResolve = resolve;
    /* If readFolderForPlugins promise resolves at once - meaning there were no untrusted files trying to be loaded, we can resolve this promise aswell */
    readFolderForPlugins().then(() => {
      resolve();
    });
  });
}

module.exports = handler;
