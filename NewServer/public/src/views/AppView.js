define(function(require, exports, module) {
	
	require("js/jsqr/grid.js");
	require("js/jsqr/version.js");
	require("js/jsqr/detector.js");
	require("js/jsqr/formatinf.js");
	require("js/jsqr/errorlevel.js");
	require("js/jsqr/bitmat.js");
	require("js/jsqr/datablock.js");
	require("js/jsqr/bmparser.js");
	require("js/jsqr/datamask.js");
	require("js/jsqr/rsdecoder.js");
	require("js/jsqr/gf256poly.js");
	require("js/jsqr/gf256.js");
	require("js/jsqr/decoder.js");
	require("js/jsqr/qrcode.js");
	require("js/jsqr/findpat.js");
	require("js/jsqr/alignpat.js");
	require("js/jsqr/databr.js");
	
    var Surface          = require('famous/core/Surface');
    var Modifier         = require('famous/core/Modifier');
    var Transform        = require('famous/core/Transform');
    var View             = require('famous/core/View');
    var ContainerSurface = require("famous/surfaces/ContainerSurface");

    var MenuBarView     = require('views/MenuBarView');
    var SelectImageView      = require('views/SelectImageView');
    var DecodeQRView        = require('views/DecodeQRView');
    var DecodeQRView        = require('views/DecodeQRView');

	var imageSrc;
	
	
    function AppView() {
        View.apply(this, arguments);

        _createMenuBarView.call(this);
        _createSelectImageView.call(this);
        _createDecodeQRView.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    var height = window.innerHeight;
    AppView.DEFAULT_OPTIONS = {
        transition: {
            duration: 300,
            curve: 'easeInOut'
        },
        height: height
    };

    // add menuBar view to the appView
    function _createMenuBarView() {
        this.menuBarView = new MenuBarView();
        this.menuBarView.on('SelectImageViewToggle', this.toggleSelectImageView.bind(this));

        this.menuMod = new Modifier({
            transform: Transform.translate(0, 0, 1)
        });
        this._add(this.menuMod).add(this.menuBarView);
    }

    // add SelectImage view (access with sliede down) to the app view
    function _createSelectImageView() {
        this.selectImageView = new SelectImageView({
            duration: this.options.transition.duration
        });
		
		this.selectImageView.on('ImageLoaded', this.toggleSelectedImage.bind(this));
        
        this._add(this.selectImageView);
    }

    // background view where the image is uploaded into a canvas and decoded
    function _createDecodeQRView() {

        this.listContainerView = new ContainerSurface({
            size: [undefined, undefined],
            properties: {
                overflow: 'hidden'
            }
        });
        this.listContainerMod = new Modifier({
            transform: Transform.translate(0,44,0)
        });
        
        

        this.decodeQRView = new DecodeQRView();
        this.listMod = new Modifier();
        
        this.decodeQRView.on('SelectedImage', this.toggleSelectedImage.bind(this));

        this.listContainerView.add(this.listMod).add( this.decodeQRView);
        this._add(this.listContainerMod).add(this.listContainerView);
    }

    
    // called to slide when button is pressed
    AppView.prototype.toggleSelectImageView = function() {
        if(this.menuBarView.SelectImageViewSelected) {
            this.slideFilterDown();
        } else {
            this.slideFilterUp();
        }
    }
    
    // called when image is selected
    AppView.prototype.toggleSelectedImage = function(){
    	imageSrc = window.imageURL;
    	if(imageSrc==null) alert ('choose image before decoding');
    	else decode();	// call decode function    
    }
    
    // decode qrcode and open game context, TODO: add control when error in decoding process (at the moment the page called opens by deafult "Dragon")
    function decode(){
		qrcode.callback = function(data) { window.open("GameContext/quiz.html?qrString=" + data ,'_self');	 };
		qrcode.decode(imageSrc);
	}

    // slide up animation
    AppView.prototype.slideFilterUp = function() {
        this.listContainerMod.setTransform(Transform.translate(0, 44, 0), this.options.transition);
    }

    // slide down animation
    AppView.prototype.slideFilterDown = function() {
        this.listContainerMod.setTransform(Transform.translate(0, this.options.height, 0), this.options.transition);
    }

    module.exports = AppView;
});