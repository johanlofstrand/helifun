import ui.ImageScaleView as ImageScaleView;
import ui.View as ui.View;
import device;

exports = Class(ui.View, function (supr) {
	
	var xStart;
	var xOld;
	var xSpace;
	var noRed =0;
	var noGreen = 0;
	
	this.init = function(opts) {

		opts = merge(opts, {
			x: 0,
			y: 0,
			width: device.width,
            height: 20,
		});

		supr(this, 'init', [opts]);


		this.xStart = device.width - device.width/2 + device.width/10;
		this.xOld = this.xStart;
		this.xSpace = 60;
	
		/*opts.balloonMessenger.on('NewBalloon', bind(this,function(){
			if (this.xOld >= this.xStart + 60*5 ) { //When restart... must do this better...
				this.xOld = this.xStart - this.xSpace;  
			}
			this.balloonHandler();
		}));*/

	};

	/*this.setupScoreView = function (view) {
		this.scoreView = new ScoreView({
			superview: view,
			zIndex: 10000,
			x: 0,
			y: 10,
			width: view.style.width,
			height: 40,
			anchorX: view.style.width / 2,
			anchorY: view.style.height,
			charWidth: 25,
			charHeight: 35,
			text: "0",
			url: 'resources/images/numbers/{}.png',
		});
		return this.scoreView;
	}*/

	this.addBalloon = function(balloontype) {
			this.xNew = this.xOld + this.xSpace;
			this.balloonScoreView = new ImageScaleView({
				zIndex: 10001,	
				autoSize: true,
				superview: this,
				//backgroundColor: "#FFFFFF",
				x:this.xNew,
				y:5,
				image: 'resources/images/level/' + balloontype + '_spin_0001.png'
			});
			this.xOld = this.xNew;

	};

});










	