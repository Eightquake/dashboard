/* Import the settings.json and add the basedir as a global. */
const settings = require("../../settings.json");
global.__basedir = settings.basedir

let fs = require('fs');
const schedule = require('node-schedule');

/* Code that is used to initialize everything, as name implies it should be called when the document is ready */
const onready = require(global.__basedir + "/scripts/renderer/onready.js");
/* Plugins are the code that handles strings and does whatever it is supposed to do with it. Plugins will have it's code run over and over.
 * Details register a string or similar to a plugin. A modules code will only be run once.
 */
const registerdetails = require(global.__basedir + "/scripts/modules/renderer/registerdetails.js");
const registerplugins = require(global.__basedir + "/scripts/modules/renderer/registerplugins.js");

/* On window.onload event we know that the grid is fully ready to be filled and to be made into a Packery grid. onready.js takes care of that. */
let loaded_details = new Map();
let loaded_plugins = new Map();

window.onload = function() {
  const detailsPromise = registerdetails(loaded_details);
  const pluginsPromise = registerplugins(loaded_plugins);

  Promise.all([detailsPromise, pluginsPromise]).then(function() {
    onready(loaded_details, loaded_plugins);
  });
}
