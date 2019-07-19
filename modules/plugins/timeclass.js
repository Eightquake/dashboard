/**
  * A class for a simple plugin for displaying time and date.
  * @todo Fix update function so that it runs continuously
  * @class plugin-time
  * @author Victor Davidsson
  * @version 1.0.0
  */

class pluginTime {
  constructor(detail, gridelement) {
    this.detail = detail;
    this.gridelement = gridelement;
    this.divelement = document.createElement("div");
    this.update();
    this.gridelement.style = this.detail.style;
    this.gridelement.appendChild(this.divelement);
  }
  update() {
    let date = new Date();
    let fullDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    /* I dont quite like this solution of chaining a lot of replace-functions. Hopefully I will improve this sometime */
    this.divelement.innerText = this.detail.string
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
}

/* Exports the entire class. This way the code can create a new object from this class everytime it is needed */
module.exports = pluginTime;
