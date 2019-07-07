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
  for(var [key, value] of loaded_details) {
    /* Create a new div to be used as a grid item. */
    let newGriditem = document.createElement("div");
    newGriditem.className = "grid-item";
    for(pluginName of value.settings.used_plugins) {
      if(loaded_plugins.has(pluginName)) {
        let plugin = loaded_plugins.get(pluginName);
        if(plugin.parameter == "string" && plugin.returns == "string") {
          value.element.innerHTML = plugin.handler(value.element.innerHTML);
        }
      }

    }
    /* Add the detail to the griditem, and then add the griditem to the whole grid */
    newGriditem.appendChild(value.element);
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
