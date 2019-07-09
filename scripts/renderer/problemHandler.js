/* This script could hook into the console functions for logging and warning,
 * but I want to discourage the use of console to communicate with the user so I won't do that
 */

const EventEmitter = require('events');
let problemHandler = new EventEmitter();

process.on("uncaughtException", (err, origin) => {
  /* An Uncaught Exception is not good, let's inform the user something happened, as it wasn't handled anywhere else say that it's serious if it happens multiple times */

});

problemHandler.on("error", (errorObj) => {
  let popup = document.querySelector(".problem-popup");
  popup.innerHTML = "<h4 style='text-align:center;text-decoration:underline;'>Error:</h4>" + "<p style='padding:0 10px 0 10px'>" + errorObj + "</p>";
  popup.classList.add("problem-error", "problem-animation-run");
})

problemHandler.on("warn", (warnObj) => {

})

problemHandler.on("info", (infoObj) => {

});


module.exports = problemHandler;
