/**
  * A really simple plugin that just sets the text from the detail to the grid-item created for it.
  * @category Plugins
  * @author Victor Davidsson
  * @version 1.0.0
  */

/**
  *
  * @function
  * @public
  * @param {Object} detailArg - The detail object in it's entirety
  * @param {HTMLElement} gridElementArg The specific grid-item that is created for the detil
  */
function handler(detailArg, gridElementArg) {
  gridElementArg.innerHTML = detailArg.html;
}

/* It's important to export a object like this, so the code knows this is a module (as opposed to a class) and what function to call */
module.exports = {
  type: "module",
  init: handler
}
