/* Import the settings.json and add the basedir as a global. */
const settings = require("../../settings.json");
global.__basedir = settings.basedir

/* Scheduler module, works great and handles all of the scheduling. When a plugin needs to schedule job it should use this. */
global.schedule = require('node-schedule');
/* Error handler script, that creates the error pop-up to be used. All scripts should use this to communicate with the user */
global.problem = require(global.__basedir + "/scripts/modules/renderer/problemHandler.js");

/* Code that is used to initialize everything, as name implies it should be called when the document is ready */
const fillGrid = require(global.__basedir + "/scripts/renderer/fillGrid.js");
const initGrid = require(global.__basedir + "/scripts/renderer/initgrid.js");
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
    fillGrid(loaded_details, loaded_plugins)
    .then(initGrid());

  });
}
