/*
 * Simple Detail for creating a clock using plugin time.js. It will show up as hh:mm
 */
let name = "simpleclock";

module.exports = function(loaded_details) {
  let obj = {
    name: name,
    style: "font-size: 48px; line-height: 150px; width: 250px; height: 150px; text-align: center;",
    string: "%hh:%mm",
    settings: {
      used_plugins: ["time", "calendar"],
      update_interval: "* * * * *"
    }
  }
  /* Append the map with key name and value the object that includes everything. Will overwrite without warning! */
  loaded_details.set(name, obj);
};
