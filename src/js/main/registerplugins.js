/**
 * Reads the directory for plugins and uses require to add it into the code. While this is a convenient way to do it, really bad things could happen if a rouge file is added here or similar, as this just reads and executes all of the code it finds
 * @todo Fix so that this only requires trusted files, maybe by requiring the user to install them through the app and storing the name in localstorage?
 * @category Renderer
 * @module registerplugins
 * @author Victor Davidsson
 */

const fs = require("fs"),
  path = require("path"),
  sha256File = require("sha256-file"),
  readPath = path.join("src", "js", "modules", "plugins", "/"),
  jsRegex = /\.jsx$/i;

function handler(loaded_plugins, trustedPlugins, askUserTrustsPlugin) {
  return new Promise(function(resolve) {
    fs.readdir(readPath, function(err, files) {
      if (err) throw err;
      for (let i = 0; i < files.length; i++) {
        if (jsRegex.test(files[i])) {
          let maybeTrustedPlugin = trustedPlugins[files[i]] || undefined;
          let currentChecksum = sha256File(readPath + "/" + files[i]);
          if (maybeTrustedPlugin) {
            if (maybeTrustedPlugin.checksum === currentChecksum) {
              loaded_plugins[files[i]] = {
                type: "file",
                location: files[i].replace(jsRegex, "")
              };
            } else {
              /* TODO: Change this to be more secure during production */
              if (process.env.NODE_ENV !== "development") {
                askUserTrustsPlugin({
                  message: "The file have changed since you last trusted it",
                  file: files[i],
                  checksum: currentChecksum
                });
              }
              else {
                loaded_plugins[files[i]] = {
                  type: "file",
                  location: files[i].replace(jsRegex, "")
                };
              }
            }
          } else {
            /* The plugin is not set as trusted by the user! */
            askUserTrustsPlugin({
              message: "This file haven't been trusted before",
              file: files[i],
              checksum: currentChecksum
            });
          }
        }
      }
      resolve();
    });
  });
}

module.exports = handler;
