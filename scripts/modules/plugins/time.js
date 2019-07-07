/*
 * A simple module that displays the time.
 */

let name = "time";

function handler(string) {
  let date = new Date();
  return string.replace(/(dd)/gi, date.getHours()).replace(/(mm)/gi, date.getMinutes());
}

/* Exports a function that takes the map called loaded_plugins and adds it's own functions and information in it. */
module.exports = function(loaded_plugins) {
  let obj = {
    handler: handler,
    parameter: "string",
    returns: "string"
  }
  /* Append the map with key name and value the object that includes everything. Will overwrite without warning! */
  loaded_plugins.set(name, obj);
};
