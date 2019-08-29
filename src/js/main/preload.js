const { ipcRenderer, remote } = require("electron");

(function() {
  window.ipcRenderer = ipcRenderer;
  window.remote = remote;
})();
