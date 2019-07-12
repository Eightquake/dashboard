/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/* jQuery stuff in this block of code. */
/* Quickfix I find online for getting jQuery to load correctly with Node integration. Without this jQuery sees it's a module and tries to do some stuff it shouldn't. */
window.$ = window.jQuery = require('jquery');
let jQBridget = require('jquery-bridget');
let Packery = require('packery'); /* Packery is using GNU GPL v3, and as long as my project is open-source, not commercial and also using GPL v3 it is okay for me to use it without paying for a license */
let Draggabilly = require('draggabilly'); /* Dragabilly is using MIT License, so it is okay for me to use it here */
/* I found this solution on a issue for Packery not working in Electron with node integration. I have never used bridget before, and don't quite understand jQuery plugins but hey, it worked! */
$.bridget( 'packery', Packery );
$.bridget('draggabilly', Draggabilly);

function ready(loaded_details, loaded_plugins) {
  let grid = document.querySelector(".grid");
  for(let [name, detail] of loaded_details) {
    /* Create a new div to be used as a grid item. */
    let newGriditem = document.createElement("div");
    newGriditem.className = "grid-item";
    /* Register the detail to every plugin stated */
    for(pluginName of detail.settings.used_plugins) {
      /* Make sure the plugin actually exists and is loaded */
      if(loaded_plugins.has(pluginName)) {
        let plugin = loaded_plugins.get(pluginName);
        /* Every plugin get's the detail in it's entirety, and a reference to the specific grid-item div */
        plugin.handler(detail, newGriditem);
      }
      else {
        global.problem.emit("warn", `Detail ${detail.name} needs plugin ${pluginName}, which doesn't exist. Don't expect the detail to show up correctly.`);
      }
    }
    grid.appendChild(newGriditem);
  }


  let $grid = window.$('.grid').packery({
    columnWidth: '.grid-sizer',
    gutter: '.gutter-sizer',
    itemSelector: '.grid-item',
    percentPosition: true
  });
  $grid.find('.grid-item').each( function( i, gridItem ) {
    let draggie = new Draggabilly( gridItem );
    $grid.packery( 'bindDraggabillyEvents', draggie );
  });
}

module.exports = ready;
