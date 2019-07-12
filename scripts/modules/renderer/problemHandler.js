/* This script could hook into the console functions for logging and warning,
 * but I want to discourage the use of console to communicate with the user so I won't do that
 */

const EventEmitter = require('events');
let problemHandler = new EventEmitter();
let icons = {"error": "fa-exclamation-triangle", "warn": "fa-exclamation-circle", "info": "fa-exclamation"};

function createPopup(code, problem, string) {
  let popupList = document.querySelector(".problem-popup");

  let popup = document.createElement("li");
  popup.innerHTML = `<h3><i class='fas ${icons[code]} popup-icon'></i>${problem}:</h3><p>${string}</p>`;
  popup.classList.add(`problem-${code}`, "problem-animation-run");

  let exit = document.createElement("i");
  exit.classList.add("fas", "fa-times-circle", "popup-exit");
  exit.onclick = function() {
    popupList.removeChild(popup);
  }

  popup.appendChild(exit);
  popupList.appendChild(popup);
}

process.on("uncaughtException", (err) => {
  // An Uncaught Exception is not good, let's inform the user something happened, as it wasn't handled anywhere else say that it's serious if it happens multiple times
  createPopup("error", "Critical Error", err);
});

problemHandler.on("error", (errorString) => {
  createPopup("error", "Error", errorString);
});

problemHandler.on("warn", (warnString) => {
  createPopup("warn", "Warning", warnString);
});

problemHandler.on("info", (infoString) => {
  createPopup("info", "Note", infoString);
});


module.exports = problemHandler;
