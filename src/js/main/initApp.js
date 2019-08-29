/**
 * Plugins are the code that handles strings and does whatever it is supposed to do with it. Plugins will have it's code run over and over.
 * Details register a string or similar to a plugin. A modules code will only be run once.
 */
const registerdetails = require("./registerdetails.js");
const registerplugins = require("./registerplugins.js");

/**
 * On window.onload event we know that the grid is fully ready to be filled and to be made into a Packery grid. onready.js takes care of that.
 * But first, we need to create the Maps for the loaded details and plugins. I guess these could be block-level variables instead of module-level but no harm in either.
 */

function initDone(loaded_details, loaded_plugins) {
  return new Promise(function(resolve) {
    /* Both registerdetails and registerplugins start by returning a promise, then running their code */
    const detailsPromise = registerdetails(loaded_details);
    const pluginsPromise = registerplugins(loaded_plugins);
    /* When both promises are resolved, meaning both have finished running their code we can start running all the other code that depends on the details and plugins */
    Promise.all([detailsPromise, pluginsPromise]).then(function() {
      resolve();
    });
  });
}

module.exports = initDone;
