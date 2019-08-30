/* Renderer process for Loading window */
const { ipcRenderer } = require("electron");

ipcRenderer.on("ask-user-trusts-plugin", (channel, arg) => {
  ipcRenderer.send("response-user-trusts-plugin", {
    file: arg.file,
    checksum: arg.checksum,
    response: window.confirm(
      `Do you trust plugin ${arg.file} and want to load it? ${arg.message}. This won't take effect until next start.`
    )
  });
});
