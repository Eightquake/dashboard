/* eslint-disable no-undef */

/**
  * The renderer process. It registers some global variables and on document load it starts the chain of functions that is needed to make the app work.
  * @category Renderer
  * @module renderer
  * @author Victor Davidsson
  *
  */

let path = require('path');
/**
  * __basedir is a global that points to the base directory of the project.
  * @category Renderer
  * @global
  */
__basedir = path.resolve(__dirname, "..", "..");
/**
  * Scheduler module, works great and handles all of the scheduling. When a plugin needs to schedule something it should use this.
  * @see {@link https://github.com/node-schedule} on how to use it.
  * @category Renderer
  * @global
  */
global.schedule = require('node-schedule');

/**
  * Error handler script, that any code can emit an event on. When an event error, warn, or info is emitted a popup will be shown to the user.
  * All scripts should use this to communicate with the user, instead of using the console or similar.
  * @see {@link module:problemHandler} for more information.
  * @category Renderer
  * @global
  */
global.problem = require(__basedir + "/scripts/renderer/problemHandler.js");

/*
  * My plan was for every plugin having to use this settings as a way to save their settings, and then removing the access to localStorage.
  * This would prevent plugins being able to snoop on eachother and stuff like that, but it's not implemented yet and I don't know when I will fix it.
  * During my commits this variable might change from global to local back and forth.
  */
let settings = require(__basedir + "/scripts/renderer/settings.js");

/**
  * Code that is used to initialize everything about the grid. fillGrid creates all of the needed elements in the grid and initGrid starts Packery and everything else needed for Packery to work
  */
const fillGrid = require(__basedir + "/scripts/renderer/fillGrid.js");
const initGrid = require(__basedir + "/scripts/renderer/initGrid.js");

/**
  * Plugins are the code that handles strings and does whatever it is supposed to do with it. Plugins will have it's code run over and over.
  * Details register a string or similar to a plugin. A modules code will only be run once.
  */
const registerdetails = require(__basedir + "/scripts/renderer/registerdetails.js");
const registerplugins = require(__basedir + "/scripts/renderer/registerplugins.js");

/**
  * On window.onload event we know that the grid is fully ready to be filled and to be made into a Packery grid. onready.js takes care of that.
  * But first, we need to create the Maps for the loaded details and plugins. I guess these could be block-level variables instead of module-level but no harm in either.
  */
let loaded_details = new Map();
let loaded_plugins = new Map();
let created_plugins = [];
window.onload = function() {
  /* Both registerdetails and registerplugins start by returning a promise, then running their code */
  const detailsPromise = registerdetails(loaded_details);
  const pluginsPromise = registerplugins(loaded_plugins);

  /* When both promises are resolved, meaning both have finished running their code we can start running all the other code that depends on the details and plugins */
  Promise.all([detailsPromise, pluginsPromise]).then(function() {
    settings.init()
      .then(fillGrid(loaded_details, loaded_plugins, created_plugins)
      .then(initGrid()));
  });
}
