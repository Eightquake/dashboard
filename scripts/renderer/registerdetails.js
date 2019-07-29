/**
  * Reads the directory for details and uses require to add it into the code. While this is a convenient way to do it, really bad things could happen if a rouge file is added here or similar, as this just reads and executes all of the code it finds
  * @todo Fix so that this only requires trusted files, maybe by requiring the user to install them through the app and storing the name in localstorage?
  * @category Renderer
  * @module registerdetails
  * @author Victor Davidsson
  *
  */

let fs = require("fs");
let readPath = __basedir + "/modules/details/";

let jsonRegex = /\.json$/i;
let jsRegex = /\.js$/i;

function handler(loaded_details) {
  return new Promise(function(resolve) {
    fs.readdir(readPath, function(err, files) {
      for (let i = 0; i < files.length; i++) {
        if(jsonRegex.test(files[i])) {
          /* The file is a JSON-file, as it ends with .json or .JSON. As a JSON-file we can just import it and there's no need to call it */
          try {
            loaded_details.set(files[i], require(readPath + [files[i]]));
          }
          catch(error) {
            global.problem.emit("error", `An error occured while trying to load detail ${files[i]} as a JSON-file.<br>${error}`);
          }
        }
        else if(jsRegex.test(files[i])) {
          /* The file is a JavaScript-file, as it ends with .js or .JS. We should call the function it hopefully exports */
          let file;
          try {
            file = require(readPath + [files[i]]);
          }
          catch(error) {
            global.problem.emit("error", `An error occured while trying to load detail ${files[i]} as a js-file.<br>${error}`);
          }

          if(typeof file === "function") {
            try {
              loaded_details.set(files[i], file());
            }
            catch(error) {
              global.problem.emit("error", `An error occured while trying to save detail ${files[i]} by calling it as a function.<br>${error}`);
            }
          }
          else {
            try {
              loaded_details.set(files[i], file);
            }
            catch(error) {
              global.problem.emit("error", `An error occured while trying to save detail ${files[i]} by treating as a object.<br>${error}`);
            }
          }
        }
      }
      resolve();
    });
  });
}

module.exports = handler;
