window.$ = window.jQuery = require('jquery');
let jQBridget = require('jquery-bridget');
let Packery = require('packery'); /* Packery is using GNU GPL v3, and as long as my project is open-source, not commercial and also using GPL v3 it is okay for me to use it without paying for a license */
let Draggabilly = require('draggabilly'); /* Dragabilly is using MIT License, so it is okay for me to use it here */
let fs = require('fs');

global.schedule = require('node-schedule');

/* I found this solution on a issue for Packery not working in Electron with node integration. I have never used bridget before, and don't quite understand jQuery plugins but hey, it worked! */
$.bridget( 'packery', Packery );
$.bridget('draggabilly', Draggabilly);

/* On Document.ready event we know that the grid is fully ready to be filled and to be made into a Packery grid */
let loaded_modules = [];
let time;
$(document).ready(function () {
  loaded_modules[0] = require("../modules/time.js");

  loaded_modules.forEach((module) => {
    let newGriditem = document.createElement("div");
    newGriditem.className = "grid-item " + module.name;
    newGriditem.innerHTML = module.innerHTML;
    newGriditem.style = module.style;

    let grid = document.querySelector(".grid");
    grid.appendChild(newGriditem);
  });


  let $grid = $('.grid').packery({
    columnWidth: '.grid-sizer',
    gutter: '.gutter-sizer',
    itemSelector: '.grid-item',
    percentPosition: true
  });
  $grid.find('.grid-item').each( function( i, gridItem ) {
    let draggie = new Draggabilly( gridItem );
    $grid.packery( 'bindDraggabillyEvents', draggie );
  });
});
