const less = require(global.__basedir + "/scripts/renderer/less.min.js");
const remote = require('electron').remote;

let settingsObj = {
  lessTheme: {
    hue: 100,
    sat: 20,
    light: 30
  }
}
function updateSettings(string, obj) {
  settingsObj[string] = obj;
  localStorage.setItem("settingsObj", JSON.stringify(settingsObj));
}

function changeLessTheme(hue, sat = 30, light = 20) {
  updateSettings("lessTheme", {
    hue: hue,
    sat: sat,
    light: light
  });
  less.modifyVars({
    "@backgroundColor": `hsl(${hue}, ${sat}%, ${light}%);`,
    "@accentColor": "hardlight(@backgroundColor, #CCCCCC);"
  });
}

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

    if(localStorage.getItem("settingsObj")) {
      settingsObj = JSON.parse(localStorage.getItem("settingsObj"));
    }
    else {
      localStorage.setItem("settingsObj", JSON.stringify(settingsObj));
    }
    let theme = settingsObj.lessTheme;
    changeLessTheme(theme.hue, theme.sat, theme.light);

    resolve();
  });
}

module.exports = {
  init: initSettings,
  change: changeLessTheme,
  obj: settingsObj
}
