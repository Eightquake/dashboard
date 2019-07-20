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
    /* count is used for Packery to restore the last layout, every grid-element gets its own id starting from 1 and going up. If count is 0 there is no detail at all. */
    let count = 0;
    /* As the init function of settings.js have been run we know that the localStorage will have the theme-choice, which is needed when creating the grid-items. */
    let theme = localStorage.getItem("settings-theme");

    /* Loop trough the map loaded_details and save the key as variable name and value as detail */
    for(let [name, detail] of loaded_details) {
      /* Create a new div to be used as a grid item. */
      let newGriditem = document.createElement("div");
      newGriditem.classList.add("grid-item", name, `${theme}-theme`);
      newGriditem.dataset.itemId = ++count;

      /* Register the detail to every plugin stated */
      for(let pluginName of detail.settings.used_plugins) {
        /* Make sure the plugin actually exists and is loaded */
        if(loaded_plugins.has(pluginName)) {
          if(loaded_plugins.get(pluginName).type == "class") {
            let Plugin = loaded_plugins.get(pluginName).class;
            /* Create a new object of the Plugin, calling the constructor with the detail in it's entirety, and a reference to the specific grid-item div. Optionally it also gets the name of the specific detail */
            created_plugins.push(new Plugin(detail, newGriditem, name));
          }
          else if (loaded_plugins.get(pluginName).type == "module") {
            let plugin = loaded_plugins.get(pluginName);
            /* Every plugin gets the detail in it's entirety, and a reference to the specific grid-item div. Optionally it also gets the name of the specific detail */
            plugin.init(detail, newGriditem, name);
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
