/*
 * Simple Detail for creating a clock using plugin time.js. It will show up as dd:mm
 */
let name = "simpleclock";

let div = document.createElement("div");
div.className = name;
div.style = "font-size: 48px; line-height: 150px; width: 250px; height: 150px; text-align: center;";
div.innerHTML = "dd:mm";

module.exports = function(loaded_details) {
  let obj = {
    element: div,
    settings: {
      used_plugins: ["time"],
      update_interval: 1000
    }
  }
  /* Append the map with key name and value the object that includes everything. Will overwrite without warning! */
  loaded_details.set(name, obj);
};
