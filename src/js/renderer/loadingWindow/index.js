/* Renderer process for Loading window */
const { ipcRenderer } = require("electron");

ipcRenderer.on("start-loading-file", (event, arg) => {
  /*  document.querySelector(".loading-progress").value = 0; */
  let element = document.createElement("li");
  element.id = arg;
  element.innerHTML = `<p>File: ${arg}.jsx</p><p id="${arg}" class="loading-text">Loading...</p>`;
  document.querySelector("ul").appendChild(element);
});

ipcRenderer.on("finish-loading-file", (event, arg) => {
  document.querySelector(`p#${arg}.loading-text`).innerHTML = "Done!";
});

ipcRenderer.on("ask-user-trusts-file", (event, arg) => {
  document.querySelector(
    `p#${arg.file}.loading-text`
  ).innerHTML = `Loading blocked.<br>Reason: ${arg.message}<br>Do you trust this plugin?`;
  let confirm = document.createElement("button");
  confirm.onclick = function() {
    document
      .querySelector(`ul`)
      .removeChild(document.querySelector(`li#${arg.file}`));
    ipcRenderer.send("user-plugin-trusts-answer", {
      file: arg.file,
      checksum: arg.checksum
    });
  };
  confirm.innerHTML = "Yes";
  document.querySelector(`p#${arg.file}.loading-text`).appendChild(confirm);
});
