/*
 * Simple Detail for displaying the date using plugin time.js.
 */

module.exports = {
  style: "font-size: 32px; width: 300px; text-align: center;",
  string: "Today is:\n%DDDD, %MMMM %d\n%yyyy-%MM-%d\nAnd the time is:\n%hh:%mm",
  settings: {
    used_plugins: ["time.js"],
    update_interval: "0 0 0 * *"
  }
}
