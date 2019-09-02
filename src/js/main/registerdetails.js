/**
 * Reads the directory for details and uses require to add it into the code. While this is a convenient way to do it, really bad things could happen if a rouge file is added here or similar, as this just reads and executes all of the code it finds
 * @todo Fix so that this only requires trusted files, maybe by requiring the user to install them through the app and storing the name in localstorage?
 * @category Main
 * @module registerdetails
 * @author Victor Davidsson
 */

const fs = require("fs"),
  path = require("path"),
  readPath = path.join(__dirname, "..", "modules", "details", "/"),
  jsonRegex = /\.json$/i;

function handler(loaded_details) {
  return new Promise(function(resolve) {
    fs.readdir(readPath, function(err, files) {
      if (err) throw err;
      for (let i = 0; i < files.length; i++) {
        if (jsonRegex.test(files[i])) {
          /* The file is a JSON-file, as it ends with .json or .JSON. As a JSON-file we can just import it and there's no need to call it */
          try {
            loaded_details[files[i]] = {type: "JSON", location: files[i].replace(jsonRegex, "")};
          } catch (error) {
            console.error(
              `An error occured while trying to load detail ${files[i]} as a JSON-file. Error: ${error}`
            );
          }
        }
      }
      resolve();
    });
  });
}

module.exports = handler;
