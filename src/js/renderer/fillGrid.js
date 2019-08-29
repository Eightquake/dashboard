/* eslint-disable no-unused-vars */
/**
 * Fills the grid by creating new elements for every detail, and then calling every plugin the detail relies on with references to the grid-item and detail.
 * @category Renderer
 * @module fillGrid
 * @author Victor Davidsson
 *
 */

// *TODO*: Fix the importing of this function, it doesn't work.

/**
 * The only function in this module. It fills the div.grid with a new div.grid-item for every detail that is loaded and then it calls all of the plugins that the detail needs. It is exported and when called on it returns a promise that runs the code and resolves when it's done.
 * @function
 * @access public
 * @param {Map} loaded_details - The Map of all of the loaded details where key is the name of the detail and value is the actual detail
 * @param {Map} loaded_plugins - The Map of all of the loaded plugins where key is the name of the plugin and value is what the plugin exports
 * @returns {Promise} A promise that will resolve once all of the grid-items have been created and all of the details needed plugins have been called.
 */
function fillGrid(loaded_details, loaded_plugins, addComponentToGrid) {
  return new Promise(function(resolve) {
    /* Loop trough the map loaded_details and save the key as variable name and value as detail */
    for (let [detailName, detail] of loaded_details) {
      /* Register the detail to every plugin stated */
      for (let pluginIndex in detail.settings.used_plugins) {
        let pluginName = detail.settings.used_plugins[pluginIndex];
        /* Make sure the plugin actually exists and is loaded */
        if (loaded_plugins.has(pluginName)) {
          let plugin = loaded_plugins.get(pluginName);
          try {
            let Component = plugin.default;
            addComponentToGrid({ Component, detail });
          } catch (error) {
            global.problem.emit(
              "error",
              `There was an error trying create the component from the plugin ${pluginName} by using the default export as a class. Error: ${error}`
            );
          }
        } else {
          global.problem.emit(
            "warn",
            `Detail ${detailName} needs plugin ${detail.settings.used_plugins[pluginIndex]}, which doesn't exist. Don't expect the detail to show up correctly.`
          );
        }
      }
    }
    resolve();
  });
}

export default fillGrid;
