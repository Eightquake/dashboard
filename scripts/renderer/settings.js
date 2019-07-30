/**
  * Initializes the settings screen and all of the buttons that need to do something. Earlier, in commit c6fdfa6, this also created settings and could save them back into the code, but I didn't like how messy the code is so I reverted it.
  * @category Renderer
  * @module settings
  * @author Victor Davidsson
  *
  */

/* Remote is needed to manipulate the window when pressing the buttons - minimize, maximise and close. */
const remote = require('electron').remote;

/**
  * The only function in this module. It adds functions to do the right thing when a button is clicked - like maximise or minimize the window and sets or changes the theme. It is exported and when called on it returns a promise that runs the code and resolves when it's done.
  * @function
  * @access public
  * @returns {Promise} A promise that will resolve once all of the buttons have had their events hooked and the theme has been set or changed.
  */
function initSettings() {
  return new Promise(function(resolve) {
    /* Add the functions to manipulate the window to the buttons. Maybe this would be easier with React, but I don't know React so I won't use it. */
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

    /* Add function to the settings cog to open the settings window, or close it if it is already open */
    document.querySelector("button#settings").onclick = function() {
      let settingsDiv = document.querySelector("div.settings")
      /* If the display is none, change it to block - otherwise set it to none. This allows the settings-cog to toggle the settings screen */
      settingsDiv.style.display = settingsDiv.style.display === 'none'? "block" : 'none';
    }
    /* Also add function to the settings close button to hide the settings window */
    document.querySelector("i.settings-exit").onclick = function() {
      document.querySelector("div.settings").style.display = "none";
    }
    /* When pressing the save button for the theme choice on the settings screen, update the entire document to match the theme selected and save it for the future */
    document.querySelector("button.theme-choice").onclick = function() {
      /* I use toLowerCase because in index.html the value is capitalized, but everywhere in the code it is all lowercase */
      let choice = document.querySelector("input.theme-choice:checked").value;
      let setting = localStorage.getItem("settings-theme");
      /* Only update if the choice of theme has actually been changed */
      if(choice != setting) {
        localStorage.setItem("settings-theme", choice);
        document.querySelector("link.theme-choice").href = choice + "theme.css";
        document.body.classList.replace(setting, choice);
      }
    }

    /* At startup, if the theme is set, set the correct radio button as checked in settings and if the theme is light update the entire document */

    let settingsTheme = localStorage.getItem("settings-theme") || "light";
    document.querySelector(`input.theme-choice[value=${settingsTheme}]`).checked = true;
    document.body.className = settingsTheme;

    resolve();
  });
}

module.exports = {
  init: initSettings,
}
