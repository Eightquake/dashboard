/**
  * Simple Detail for creating a clock and date using plugin time.js. The update interval of every minute is a bit unneccessary for the date but needed for the clock, and as plugin time.js does not support more than one detail currently this is how it shall be.
  */

module.exports = function() {
  return {
    style: "font-size: 48px; width: 500px; padding:20px; text-align: center;",
    string: "%hh:%mm\n%DDDD, %MMMM %d\n%yyyy-%MM-%d",
    settings: {
      used_plugins: ["time.js"],
      update_interval: "0 * * * *"
    }
  }
};
