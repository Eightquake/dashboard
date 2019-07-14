const less = require(global.__basedir + "/scripts/renderer/less.min.js");
const remote = require('electron').remote;
const caller = require('caller');

let settingsObj = {
  lessTheme: {
    hue: 100,
    sat: 20,
    light: 30
  },
  test: {
    foo: "bar"
  }
}
let translateObj = {
  lessTheme: {
    category: "Colors",
    description: "Background color, and to an extent the entire theme. Color should be entered as a HSL-based color.",
    hue: "Hue (0-360)",
    sat: "Saturation (0-100)",
    light: "Lightness (0-100)"
  },
  test: {
    category: "Testing",
    description: "Because I needed to test if my code works with more than one setting.",
    foo: "Foo (string)"
  }
}

function updateLessTheme() {
  let theme = settingsObj.lessTheme;
  less.modifyVars({
    "@backgroundColor": `hsl(${theme.hue}, ${theme.sat}%, ${theme.light}%);`,
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
    for(let obj in settingsObj) {
      let a = document.createElement("a");
      a.href = "#" + obj.toString();
      a.innerText = translateObj[obj].category;

      document.querySelector("div.settings-categories").appendChild(a);

      let div = document.createElement("div");
      div.className = "setting";
      div.id = obj.toString();
      div.innerHTML = `<h3>${translateObj[obj].category}</h3><p>${translateObj[obj].description}</p>`;
      for(let setting in settingsObj[obj]) {
        let label = document.createElement("label");
        label.for = setting.toString();
        label.innerText = translateObj[obj][setting];
        let input = document.createElement("input");
        input.type = "text";
        input.className = obj.toString();
        input.name = setting.toString();
        input.value = settingsObj[obj][setting];

        div.appendChild(label);
        div.appendChild(input);
      }
      let button = document.createElement("button");
      button.type = "button";
      button.innerText = "Save";
      button.onclick = function() {
        let inputs = document.querySelectorAll("input."+obj.toString());
        inputs.forEach(function(input) {
          settingsObj[input.className][input.name] = input.value;
        });
        localStorage.setItem("settingsObj", JSON.stringify(settingsObj));

        if(obj === "lessTheme") {
          updateLessTheme();
        }
      }
      div.appendChild(button);
      document.querySelector("div.settings-list").appendChild(div);
    }
    updateLessTheme();
    resolve();
  });
}

function updateSettings(string, obj) {
  settingsObj[string] = obj;
  localStorage.setItem("settingsObj", JSON.stringify(settingsObj));
}

function getSettings() {
  return settingsObj[encodeURI(caller())];
}

function setSettings(setting) {
  updateSettings(encodeURI(caller()), setting);
}

module.exports = {
  init: initSettings,
  get: getSettings,
  set: setSettings,
}
