/**
  * Reads the directory for plugins and uses require to add it into the code. While this is a convenient way to do it, really bad things could happen if a rouge file is added here or similar, as this just reads and executes all of the code it finds
  * @author Victor Davidsson
  * @version 0.1.0
  */

let fs = require("fs");
let readPath = global.__basedir + "/scripts/modules/plugins/";

function handler(loaded_plugins) {
  return new Promise(function(resolve) {
    fs.readdir(readPath, function(err, files) {
      for (let i = 0; i < files.length; i++) {
        loaded_plugins.set(files[i], require(readPath + files[i])());
      }
      resolve();
    });
  });
}

module.exports = handler;
