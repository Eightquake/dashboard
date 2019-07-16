/**
  * Fills the grid by creating new elements for every detail, and then calling every plugin the detail relies on with references to the grid-item and detail.
  * @author Victor Davidsson
  * @version 0.1.0
  */

function fillGrid(loaded_details, loaded_plugins) {
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
          let plugin = loaded_plugins.get(pluginName);
          /* Every plugin getss the detail in it's entirety, and a reference to the specific grid-item div. Optionally it also gets the name of the specific detail */
          plugin.handler(detail, newGriditem, name);
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
