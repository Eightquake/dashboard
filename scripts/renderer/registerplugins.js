/**
  * Reads the directory for plugins and uses require to add it into the code. While this is a convenient way to do it, really bad things could happen if a rouge file is added here or similar, as this just reads and executes all of the code it finds
  * @todo Fix so that this only requires trusted files, maybe by requiring the user to install them through the app and storing the name in localstorage?
  * @category Renderer
  * @module registerplugins
  * @author Victor Davidsson
  *
  */

let fs = require("fs");
let readPath = __basedir + "/modules/plugins/";

let jsRegex = /\.js$/i;

function handler(loaded_plugins) {
  return new Promise(function(resolve) {
    fs.readdir(readPath, function(err, files) {
      for (let i = 0; i < files.length; i++) {
        if(jsRegex.test(files[i])) {
          let file;
          try {
            file = require(readPath + files[i]);
          }
          catch(error) {
            global.problem.emit("error", `An error occured while trying to load plugin ${files[i]}.<br>${error}`);
          }
          if(file.type == "class" || file.type == "module") {
            try {
              loaded_plugins.set(files[i], file);
            }
            catch(error) {
              global.problem.emit("error", `An error occured while trying to save plugin ${files[i]}.<br>${error}`);
            }
          }
          else {
            global.problem.emit("warn", `Plugin ${files[i]} does not export a type-property or it isn't one of the supported ones.`);
          }
        }
      }
      resolve();
    });
  });
}

module.exports = handler;
