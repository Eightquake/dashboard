/**
  * Reads the directory for details and uses require to add it into the code. While this is a convenient way to do it, really bad things could happen if a rouge file is added here or similar, as this just reads and executes all of the code it finds
  * @author Victor Davidsson
  * @version 0.1.0
  */

let fs = require("fs");
let readPath = global.__basedir + "/scripts/modules/details/";

let jsonRegex = /\.json$/gi;
let jsRegex = /\.js$/gi;

function handler(loaded_details) {
  return new Promise(function(resolve) {
    fs.readdir(readPath, function(err, files) {
      for (let i = 0; i < files.length; i++) {
        if(jsonRegex.test(files[i])) {
          /* The file is a JSON-file, as it ends with .json or .JSON. As a JSON-file we can just import it and there's no need to call it */
          loaded_details.set(files[i], require(readPath + [files[i]]));
        }
        else if(jsRegex.test(files[i])) {
          /* The file is a JavaScript-file, as it ends with .js or .JS. We should call the function it hopefully exports */
          loaded_details.set(files[i], require(readPath + [files[i]])());
        }
      }
      resolve();
    });
  });
}

module.exports = handler;
