/**
 * Reads the directory for plugins and uses require to add it into the code. While this is a convenient way to do it, really bad things could happen if a rouge file is added here or similar, as this just reads and executes all of the code it finds
 * @todo Fix so that this only requires trusted files, maybe by requiring the user to install them through the app and storing the name in localstorage?
 * @category Renderer
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

let trustedPlugins = {};

ipcMain.on("user-plugin-trusts-answer", (event, arg) => {
  let configToSave = config.get("trusted-plugins");
  configToSave[arg.file] = { file: arg.file, checksum: arg.checksum };

  config.set("trusted-plugins", configToSave);
  trustedPlugins = configToSave;

  alreadyAskedFiles.splice(alreadyAskedFiles.indexOf(arg.file + ".jsx"), 1);

  if (alreadyAskedFiles.length === 0) {
    readFolderForPlugins().then(() => {
      handlerPromiseResolve();
    });
  }
});

let alreadyAskedFiles = [];
function readFolderForPlugins() {
  return new Promise(function(resolve) {
    fs.readdir(readPath, function(err, files) {
      if (err) throw err;
      for (let i = 0; i < files.length; i++) {
        if (jsRegex.test(files[i])) {
          let fileName = files[i].replace(jsRegex, "");
          loadingWindowWC.send("start-loading-file", fileName);
          let maybeTrustedPlugin = trustedPlugins[fileName] || undefined;
          let currentChecksum = sha256File(readPath + "/" + files[i]);
          if (
            maybeTrustedPlugin &&
            maybeTrustedPlugin.checksum === currentChecksum
          ) {
            loadedPlugins[files[i]] = {
              type: "file",
              location: fileName
            };
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
            alreadyAskedFiles.push(files[i]);
          }
        }
      }
      if (
        Object.keys(loadedPlugins).length > 0 &&
        Object.keys(loadedPlugins).length === Object.keys(trustedPlugins).length
      ) {
        resolve();
      }
    });
  });
}

let loadedPlugins, loadingWindowWC, handlerPromiseResolve;
function handler(loaded_plugins, loadingWindowWCArg) {
  loadedPlugins = loaded_plugins;
  loadingWindowWC = loadingWindowWCArg;

  if (config.has("trusted-plugins")) {
    trustedPlugins = config.get("trusted-plugins");
  } else {
    config.set("trusted-plugins", trustedPlugins);
  }

  return new Promise(function(resolve) {
    handlerPromiseResolve = resolve;
    readFolderForPlugins().then(() => {
      resolve();
    });
  });
}

module.exports = handler;
