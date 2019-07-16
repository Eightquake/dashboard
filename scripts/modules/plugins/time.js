/*
 * A simple module that displays the time.
 * Can only handle one detail at a time - I think this is a limitation to node-schedule
 */

let detail, divelement;

let fullDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function handler(detailArg, gridelementArg) {
  detail = detailArg;

  divelement = document.createElement("div");
  update();

  gridelementArg.style = detail.style;
  gridelementArg.appendChild(divelement);

  global.schedule.scheduleJob(detail.settings.update_interval, update);
}

function update() {
  let date = new Date();
  /* I dont quite like this solution of chaining a lot of replace-functions. Hopefully I will improve this sometime */
  divelement.innerText = detail.string
    .replace(/(%hh)/g, date.getHours())
    .replace(/(%mm)/g, (date.getMinutes()<10)?"0" + date.getMinutes():date.getMinutes())
    .replace(/(%ss)/g, date.getSeconds())
    .replace(/(%DDDD)/g, fullDays[date.getDay()])
    .replace(/(%DD)/g, fullDays[date.getDay()].substring(0, 3))
    .replace(/(%d)/g, (date.getDate()<10)?"0" + date.getDate():date.getDate())
    .replace(/(%MMMM)/g, fullMonths[date.getMonth()])
    .replace(/(%MMMM)/g, fullMonths[date.getMonth()])
    .replace(/(%MMM)/g, fullMonths[date.getMonth()].substring(0, 3))
    .replace(/(%MM)/g, ((date.getMonth() < 9) ? "0" + (date.getMonth() + 1) : date.getMonth() + 1))
    .replace(/(%m)/g, date.getMonth()+1)
    .replace(/(%yyyy)/g, date.getFullYear())
    .replace(/(%y)/g, date.getFullYear() - 2000); /* I mean, this will work for a long time - but not forever. */
}

/* Exports an object with everything needed for the plugin to function. */
module.exports = function () {
  return {
    handler: handler
  }
}
