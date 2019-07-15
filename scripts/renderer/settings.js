const remote = require('electron').remote;

function initSettings() {
  return new Promise(function(resolve) {
    document.querySelector("button#minimize").onclick = function() {
      const window = remote.getCurrentWindow();
      window.minimize();
    }
    document.querySelector("button#maximize").onclick = function() {
      const window = remote.getCurrentWindow();
      if (!window.isMaximized()) {
      window.maximize();
      } else {
      window.unmaximize();
      }
    }
    document.querySelector("button#close").onclick = function() {
      const window = remote.getCurrentWindow();
      window.close();
    }
    document.querySelector("button#settings").onclick = function() {
      let settingsDiv = document.querySelector("div.settings")
      /* If the display is none, change it to block - otherwise set it to none. This allows the settings-cog to toggle the settings screen */
      settingsDiv.style.display = settingsDiv.style.display === 'none'? "block" : 'none';
    }
    document.querySelector("i.settings-exit").onclick = function() {
      document.querySelector("div.settings").style.display = "none";
    }

    document.querySelector("button.theme-choice").onclick = function() {
      let choice = document.querySelector("input.theme-choice:checked").value.toLowerCase();
      let setting = localStorage.getItem("settings-theme");
      if(choice != setting) {
        localStorage.setItem("settings-theme", choice);
        document.querySelectorAll(`.${setting}-theme`).forEach(function(element) {
          element.classList.replace(`${setting}-theme`, `${choice}-theme`);
        });
      }
    }

    if(localStorage.getItem("settings-theme")) {
      let settingsTheme = localStorage.getItem("settings-theme");
      settingsTheme = settingsTheme.charAt(0).toUpperCase() + settingsTheme.slice(1);
      document.querySelector(`input.theme-choice[value=${settingsTheme}]`).checked = true;
      if(settingsTheme != "Dark") {
        document.querySelectorAll(".dark-theme").forEach(function(element) {
          element.classList.replace("dark-theme", "light-theme");
        });
      }
    }
    else {
      document.querySelector("input[value=Dark]").checked = true;
      localStorage.setItem("settings-theme", "dark");
    }
    resolve();
  });
}

module.exports = {
  init: initSettings,
}
