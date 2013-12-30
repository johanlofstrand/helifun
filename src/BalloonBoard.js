import ui.ImageScaleView as ImageScaleView;
import ui.View as ui.View;
import device;

exports = Class(ui.View, function (supr) {
	
	var xOld;
	var xSpace;
	
	this.init = function(opts) {

		opts = merge(opts, {
			x: 0,
			y: 0,
			width: device.width,
            height: 20,
		});

		supr(this, 'init', [opts]);

		this.xOld = device.width - device.width/2 + device.width/10;
		this.xSpace = 60;
	
		opts.balloonMessenger.on('NewBalloon', bind(this,function(){
			console.log('NewBalloon');
			this.balloonHandler();
		}));

	};
	this.balloonHandler = function() {
			this.xNew = this.xOld + this.xSpace;
			console.log("X: " + this.xNew);
			this.balloonScoreView = new ImageScaleView({
				zIndex: 10001,	
				autoSize: true,
				superview: this,
				//backgroundColor: "#FFFFFF",
				x:this.xNew,
				y:5,
				image: 'resources/images/level/jgold_spin_0001.png'		
			});
			this.xOld = this.xNew;

	};

});










	