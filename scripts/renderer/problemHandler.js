/**
  * Exports an EventEmitter so that other modules can emit an event on it that is handled here. The events are types of problems: warning, error and similar and when an event is emitted the function createPopup creates a popup for the user to see.
  * <br>This script could hook into the console functions for logging and warning, but I want to discourage the use of console to communicate with the user so I won't do that
  * @category Renderer
  * @module problemHandler
  * @author Victor Davidsson
  * @version 1.0.0
  */

/* The EventEmitter is the only thing exported as of now, and when another module emits a event on it the handlers here handle it */
const EventEmitter = require('events');
let problemHandler = new EventEmitter();

/* Object to "translate" the event name to a icon */
let icons = {"error": "fa-exclamation-triangle", "warn": "fa-exclamation-circle", "info": "fa-exclamation"};

function createPopup(code, problem, string) {
  let popupList = document.querySelector(".problem-popup");

  let popup = document.createElement("li");
  popup.innerHTML = `<div class="popup-header"><i class='fas ${icons[code]} popup-icon'></i><h3>${problem}:</h3></div><p>${string}</p>`;
  popup.classList.add(`problem-${code}`, "problem-animation-run");

  let exit = document.createElement("i");
  exit.classList.add("fas", "fa-times", "popup-exit");
  exit.onclick = function() {
    popupList.removeChild(popup);
  }

  popup.appendChild(exit);
  popupList.appendChild(popup);
}

/* NODE_ENV shouldn't be defined unless it's running in production. While developing I want uncaught exceptions to go to the console, but when using the application I don't want that */
if(process.env.NODE_ENV) {
  process.on("uncaughtException", (err) => {
    // An Uncaught Exception is not good, let's inform the user something happened, as it wasn't handled anywhere else say that it's serious if it happens multiple times
    createPopup("error", "Critical Error", err);
  });
}

/**
  * Error event, when this is emitted on the {@link problem} EventEmitter it will create a red popup with a critical-warning symbol
  * @category Renderer
  * @event error
  */
problemHandler.on("error", (errorString) => {
  createPopup("error", "Error", errorString);
});

/**
  * Warning event, when this is emitted on the {@link problem} EventEmitter it will create a yellow popup with a warning symbol
  * @category Renderer
  * @event warn
  */
problemHandler.on("warn", (warnString) => {
  createPopup("warn", "Warning", warnString);
});

/**
  * Information event, when this is emitted on the {@link problem} EventEmitter it  will create a grey popup with a exclamation point as a symbol
  * @category Renderer
  * @event info
  */
problemHandler.on("info", (infoString) => {
  createPopup("info", "Note", infoString);
});


module.exports = problemHandler;
