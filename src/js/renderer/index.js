let registeredDetails,
  registeredPlugins,
  loadedDetails = new Map(),
  loadedPlugins = new Map();
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
