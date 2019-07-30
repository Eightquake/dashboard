/**
  * Fills the grid by creating new elements for every detail, and then calling every plugin the detail relies on with references to the grid-item and detail.
  * @category Renderer
  * @module fillGrid
  * @author Victor Davidsson
  *
  */

/**
  * The only function in this module. It fills the div.grid with a new div.grid-item for every detail that is loaded and then it calls all of the plugins that the detail needs. It is exported and when called on it returns a promise that runs the code and resolves when it's done.
  * @function
  * @access public
  * @param {Map} loaded_details - The Map of all of the loaded details where key is the name of the detail and value is the actual detail
  * @param {Map} loaded_plugins - The Map of all of the loaded plugins where key is the name of the plugin and value is what the plugin exports
  * @returns {Promise} A promise that will resolve once all of the grid-items have been created and all of the details needed plugins have been called.
  */
function fillGrid(loaded_details, loaded_plugins, created_plugins) {
  return new Promise(function(resolve) {
    /* Loop trough the map loaded_details and save the key as variable name and value as detail */
    for(let [fileName, detail] of loaded_details) {
      /* Create a new div to be used as a grid item. */
      let newGriditem = document.createElement("div");
      /* Using fileName as a classname made some trouble when the file extension was included. Therefore, remove the group that starts with a dot and any number of characters then end-of-string. This should only capture any file-extension */
      let name = fileName.replace(/\.(.*)$/g, "");
      newGriditem.id = name;
      newGriditem.classList.add("grid-item", name);
      /* data-item-id is used for Packery to restore the last layout, every grid-element gets its own id that is the details filename excluding the extension. */
      newGriditem.dataset.itemId = name;

      /* Register the detail to every plugin stated */
      for(let pluginName of detail.settings.used_plugins) {
        /* Make sure the plugin actually exists and is loaded */
        if(loaded_plugins.has(pluginName)) {
          if(loaded_plugins.get(pluginName).type == "class") {
            try {
              let Plugin = loaded_plugins.get(pluginName).class;
              /* Create a new object of the Plugin, calling the constructor with the detail in it's entirety, and a reference to the specific grid-item div. Optionally it also gets the name of the specific detail */
              created_plugins.push(new Plugin(detail, newGriditem, name));
            }
            catch(error) {
              global.problem.emit("error", `An error occured while trying to create plugin ${pluginName} as a Class for detail ${detail}.<br>${error}`);
            }
          }
          else if (loaded_plugins.get(pluginName).type == "module") {
            try {
              let plugin = loaded_plugins.get(pluginName);
              /* Every plugin gets the detail in it's entirety, and a reference to the specific grid-item div. Optionally it also gets the name of the specific detail */
              plugin.init(detail, newGriditem, name);
            }
            catch(error) {
              global.problem.emit("error", `An error occured while trying to call plugin ${pluginName} as a module for detail ${detail}.<br>${error}`);
            }
          }
        }
        else {
          global.problem.emit("warn", `Detail ${name} needs plugin ${pluginName}, which doesn't exist. Don't expect the detail to show up correctly.`);
        }
      }
      document.querySelector(".grid").appendChild(newGriditem);
    }
    resolve();
  });
}

module.exports = fillGrid;
