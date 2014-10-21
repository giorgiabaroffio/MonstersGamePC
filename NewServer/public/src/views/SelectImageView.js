define(function(require, exports, module) {

	require("js/jsqr/qrcode.js");
	
	var Engine = require('famous/core/Engine');
    var Surface    = require('famous/core/Surface');
    var Modifier   = require('famous/core/Modifier');
    var Transform  = require('famous/core/Transform');
    var View       = require('famous/core/View');
    var GridLayout = require("famous/views/GridLayout");
    var Time       = require('famous/utilities/Timer');
	var InputSurface = require("famous/surfaces/InputSurface");
    
    var surface;
	var input;
    this.qrString;

    function SelectImageView() {
        View.apply(this, arguments);

        _createBackground.call(this);
	
    }

    SelectImageView.prototype = Object.create(View.prototype);
    SelectImageView.prototype.constructor = SelectImageView;

    // html5 input to acquire image, different on mobile versione where cordova API are used
    function _createBackground() {
			
         surface = new Surface({         	
         	//content: "<input type='file' accept='image/*' onchange='picChange(event)'/>",
            properties: {            	
                marginTop: '44px',
                backgroundColor: '#323153'
            }
        });

        this._add(surface);
		
		input = new InputSurface({
			size: [undefined, 44],
			name: 'inputSurface',
			type: 'file',
			properties: {            	
                marginTop: '50px',
				marginLeft: '6px',
                backgroundColor: '#323153'
            }
		});

		this._add(input);
		
		input.on('change', function(e) {
			picChange(e);
		});
		
		function picChange(event) 
        {       
			var fileInput=event.target.files; 
			if(fileInput.length>0){
				var windowURL=window.URL || window.webkitURL; 
				var picURL = windowURL.createObjectURL(fileInput[0]);
				//get canvas
				var photoCanvas = document.getElementById("capturedPhoto");         
				var ctx = photoCanvas.getContext("2d");
				//create image
				var photo = new Image();
				photo.onload = function(){
					//draw photo into canvas when ready
					ctx.drawImage(photo, 0, 0, 250, 250);
				};
				//load photo into canvas
				photo.src = picURL;
				window.imageURL = picURL;

				if(!(picURL==null)) 
				{
					// decode qrcode and open game context, TODO: add control when error in decoding process (at the moment the page called opens by deafult "Dragon")
					qrcode.callback = function(data) { window.open("GameContext/quiz.html?qrString=" + data ,'_self');	 };
					qrcode.decode(picURL);
				}				   
			}
			
        }
		
    }
    
    
    module.exports = SelectImageView;
});