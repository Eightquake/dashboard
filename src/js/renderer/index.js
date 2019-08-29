/* eslint-disable no-undef, no-unused-vars, import/first */
/**
 * The renderer process. It registers some global variables and on document load it starts the chain of functions that is needed to make the app work.
 * @category Renderer
 * @module renderer
 * @author Victor Davidsson
 *
 */

/**
 * Error handler script, that any code can emit an event on. When an event error, warn, or info is emitted a popup will be shown to the user.
 * All scripts should use this to communicate with the user, instead of using the § or similar.
 * @see {@link module:problemHandler} for more information.
 * @category Renderer
 * @global
 */
import problemHandler from "./problemHandler.js";
global.problem = problemHandler;

import fillGrid from "./fillGrid.js";
import initGrid from "./initGrid.js";

let registeredDetails,
  registeredPlugins,
  loadedDetails = new Map(),
  loadedPlugins = new Map();

let addComponentToGrid;

/* Asynchronously Register a handler for when the main process serves the loaded modules, and then send a request for them */
ipcRenderer.on("serve-loaded-modules", (event, arg) => {
  registeredDetails = arg.details;
  registeredPlugins = arg.plugins;
  onloadReady();
});
ipcRenderer.send("request-loaded-modules", "");

async function onloadReady() {
  for (let detailName in registeredDetails) {
    let detail = registeredDetails[detailName];
    await import("../modules/details/" + detail.location + ".json").then(
      module => {
        loadedDetails.set(detailName, module);
      }
    );
  }

  for (let pluginName in registeredPlugins) {
    let plugin = registeredPlugins[pluginName];
    await import("../modules/plugins/" + plugin.location + ".jsx").then(
      module => {
        loadedPlugins.set(pluginName, module);
      }
    );
  }
  
  fillGrid(loadedDetails, loadedPlugins, addComponentToGrid)
    .then(initGrid());
}

export default function registerAddComponentToGrid(theFunction) {
  addComponentToGrid = theFunction;
}