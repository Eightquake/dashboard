/* Renderer process for Loading window */
const { ipcRenderer } = require("electron");

ipcRenderer.on("start-loading-file", (event, arg) => {
  /*  document.querySelector(".loading-progress").value = 0; */
  let element = document.createElement("li");
  element.id = arg;
  element.className = "card";
  element.innerHTML = `<div class="card-header"><h4 class="mb-0">File: ${arg}.jsx</h4></div><div class="card-body"><p id="${arg}" class="loading-text">Loading...</p></div>`;
  document.querySelector("ul").appendChild(element);
});

ipcRenderer.on("finish-loading-file", (event, arg) => {
  document.querySelector(`p#${arg}.loading-text`).innerHTML = "Done!";
});

ipcRenderer.on("ask-user-trusts-file", (event, arg) => {
  document.querySelector(
    `p#${arg.file}.loading-text`
  ).innerHTML = `${arg.message}<hr>`;
  let footer = document.createElement("div");
  footer.className = "";
  footer.innerHTML = "Do you trust this plugin?"
  let confirm = document.createElement("button");
  confirm.className = "btn btn-secondary"
  confirm.onclick = function() {
    document
      .querySelector(`ul`)
      .removeChild(document.querySelector(`li#${arg.file}`));
    ipcRenderer.send("user-plugin-trusts-answer", {
      file: arg.file,
      checksum: arg.checksum
    });
  };
  confirm.innerText = "Yes";
  footer.appendChild(confirm);
  document.querySelector(`p#${arg.file}.loading-text`).appendChild(footer);
});
