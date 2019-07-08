/*
 * Simple Detail for displaying the date using plugin time.js.
 */
let name = "simpledate";

module.exports = function(loaded_details) {
  let obj = {
    name: name,
    style: "font-size: 48px; line-height: 75px; width: 500px; height: 150px; text-align: center;",
    string: "%DDDD, %MMMM %d \n %yyyy-%MM-%d",
    settings: {
      used_plugins: ["time"],
      update_interval: "0 0 * * *"
    }
  }
  /* Append the map with key name and value the object that includes everything. Will overwrite without warning! */
  loaded_details.set(name, obj);
};
