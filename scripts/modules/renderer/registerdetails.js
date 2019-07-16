let fs = require("fs");
let readPath = global.__basedir + "/scripts/modules/details/";

function handler(loaded_details) {
  return new Promise(function(resolve) {
    fs.readdir(readPath, function(err, files) {
      for (let i = 0; i < files.length; i++) {
        require(readPath + files[i])(loaded_details);
        loaded_details.set(files[i], require(readPath + [files[i]])());
      }
      resolve();
    });
  });
}

module.exports = handler;
