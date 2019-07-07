let fs = require("fs");
let readPath = global.__basedir + "/scripts/modules/details/";

function handler(loaded_details) {
  return new Promise(function(resolve, reject) {
    fs.readdir(readPath, function(err, files) {
      for (let i = 0; i < files.length; i++) {
        require(readPath + files[i])(loaded_details);
      }
      resolve();
    });
  });
}

module.exports = handler;
