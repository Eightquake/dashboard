/**
  * Initializes the grid and everything that is needed for Packery, Draggabilly to work correctly. Also it restores the last layout if one is found.
  * @category Renderer
  * @module initGrid
  * @author Victor Davidsson
  *
  */

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
/* Try to find and create a layout, code added by me if an element is not present to slice it from the array */
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
      global.problem.emit("error", `Packery encountered a parse error: ${error}, maybe try clearing localstorage?`);
      this.layout();
      return;
    }
  }

  attr = attr || 'id'; // default to id attribute
  this._resetLayout();
  // set item order and horizontal position from saved positions
  this.items = positions.map( function( itemPosition ) {
    var selector = '[' + attr + '="' + itemPosition.attr  + '"]'
    var itemElem = this.element.querySelector( selector );
    if(itemElem) {
      var item = this.getItem( itemElem );
      item.rect.x = itemPosition.x * this.packer.width;
      return item;
    }
    else {
      /* There is no element but there is a reference to it in the localstorage. Most likely the detail got removed, so let's remove the reference to it */
      this.splice(positions.indexOf(itemPosition), 1);
      localStorage.setItem('dragPositions', JSON.stringify(positions));
    }
  }, this );
  this.shiftLayout();
};

/**
  * Initializes Packery, Draggabilly with the right settings and changes the Packery layout if one is stored in localstorage. It is exported and when called on it returns a promise that runs the code and resolves when it's done.
  * @function
  * @access public
  * @returns {Promise} A promise that will resolve once all of the grid has been initalized correctly.
  */
function initGrid() {
  return new Promise(function(resolve) {
    /* Initialize Packery on the grid, but don't initialize the layout yet, as it have to be changed */
    let $grid = window.$('.grid').packery({
      columnWidth: '.grid-sizer',
      gutter: '.gutter-sizer',
      itemSelector: '.grid-item',
      percentPosition: true,
      initLayout: false
    });
    /* Make every grid-item, the items added by fillGrid, draggable using Draggabilly */
    $grid.find('.grid-item').each( function(i, gridItem ) {
      let draggie;
      if(gridItem.innerHTML.indexOf("drag-handle") != -1) {
        draggie = new Draggabilly(gridItem, {
          handle: ".drag-handle"
        });
      }
      else {
        draggie = new Draggabilly(gridItem);
      }
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
    resolve();
  });
}

module.exports = initGrid;
