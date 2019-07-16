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
