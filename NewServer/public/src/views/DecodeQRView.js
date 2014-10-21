/*** EmptyView ***/

// define this module in Require.JS
define(function(require, exports, module) {

    // Import additional modules to be used in this view 
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface = require("famous/surfaces/ImageSurface");
    
    var background;
    

    // Constructor function for our EmptyView class
    function EmptyView() {

        
        // Applies View's constructor function to EmptyView class
        View.apply(this, arguments);
        _createBackground.call(this);
        
        
        background.on('click', function() {
            background.setProperties({
            //backgroundColor: '#878785'
            });
            this._eventOutput.emit('SelectedImage');
        }.bind(this));
        
    }
    
    // create  canvas  on the background surface 
    function _createBackground() {
            background = new Surface({
              size : [undefined,undefined],
              content: "<canvas id='capturedPhoto' width='250' height='250'></canvas>",
                properties: {
                    backgroundColor: '#C0C0C0'
                }
        });

        this._add(background);
    }

    
    // Establishes prototype chain for EmptyView class to inherit from View
    EmptyView.prototype = Object.create(View.prototype);
    EmptyView.prototype.constructor = EmptyView;

    // Default options for EmptyView class
    EmptyView.DEFAULT_OPTIONS = {};

    // Define your helper functions and prototype methods here

    module.exports = EmptyView;
});
