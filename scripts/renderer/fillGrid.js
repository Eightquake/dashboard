function fillGrid(loaded_details, loaded_plugins) {
  return new Promise(function(resolve) {
    let grid = document.querySelector(".grid");
    let count = 0;
    let theme = localStorage.getItem("settings-theme");
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
          /* Every plugin get's the detail in it's entirety, and a reference to the specific grid-item div */
          plugin.handler(detail, newGriditem);
        }
        else {
          global.problem.emit("warn", `Detail ${name} needs plugin ${pluginName}, which doesn't exist. Don't expect the detail to show up correctly.`);
        }
      }
      grid.appendChild(newGriditem);
    }
    resolve();
  });
}

module.exports = fillGrid;
