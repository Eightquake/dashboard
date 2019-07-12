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

/* These two prototype properties copied from an example of saving a layout from Packery */
/* Get JSON-friendly data for the position of items */
Packery.prototype.getShiftPositions = function( attrName ) {
  attrName = attrName || 'id';
  var _this = this;
  return this.items.map( function( item ) {
    return {
      attr: item.element.getAttribute( attrName ),
      x: item.rect.x / _this.packer.width
    }
  });
};

/* Try to find and create a layout */
Packery.prototype.initShiftLayout = function( positions, attr ) {
  if ( !positions ) {
    // if no initial positions, run packery layout
    this.layout();
    return;
  }
  // parse string to JSON
  if ( typeof positions == 'string' ) {
    try {
      positions = JSON.parse( positions );
    } catch( error ) {
      global.problem.emit("error", 'JSON parse error: ' + error);
      this.layout();
      return;
    }
  }

  attr = attr || 'id'; // default to id attribute
  this._resetLayout();
  // set item order and horizontal position from saved positions
  console.log(positions);
  this.items = positions.map( function( itemPosition ) {
    var selector = '[' + attr + '="' + itemPosition.attr  + '"]'
    var itemElem = this.element.querySelector( selector );
    var item = this.getItem( itemElem );
    item.rect.x = itemPosition.x * this.packer.width;
    return item;
  }, this );
  this.shiftLayout();
};

function initGrid() {
  console.log("initGrid");
  return new Promise(function(resolve) {
    let $grid = window.$('.grid').packery({
      columnWidth: '.grid-sizer',
      gutter: '.gutter-sizer',
      itemSelector: '.grid-item',
      percentPosition: true,
      initLayout: false
    });
    $grid.find('.grid-item').each( function( i, gridItem ) {
      let draggie = new Draggabilly( gridItem );
      $grid.packery( 'bindDraggabillyEvents', draggie );
    });
    // get saved dragged positions
    var initPositions = localStorage.getItem('dragPositions');
    // init layout with saved positions
    $grid.packery( 'initShiftLayout', initPositions, 'data-item-id' );
    // save drag positions on event
    $grid.on( 'dragItemPositioned', function() {
      // save drag positions
      var positions = $grid.packery( 'getShiftPositions', 'data-item-id' );
      localStorage.setItem( 'dragPositions', JSON.stringify( positions ) );
    });
  });
}

module.exports = initGrid;
