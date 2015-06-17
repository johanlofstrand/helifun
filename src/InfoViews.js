import ui.ImageScaleView as ImageScaleView;
import ui.widget.SliderView as SliderView;
import src.platformer.ScoreView as ScoreView;


exports.setupEnergyView = function(view) {
console.log("setupEnergyView");
	console.log("width: view.style.width/4: " + view.style.width/4);
	this.boundsWidth = 1000;
	this.energyView = new SliderView({

		superview: view,
		x: 0,
		y: 10,
		width: view.style.width/4,
		height: 25,
		zIndex: 10000,
	//	offsetX: view.style.width/10,
	//	offsetY: 10,
		thumbSize: view.style.width/4,
		active: true,
		track: {
			activeColor: '#FFFFFF' 
		},
		thumb: {
			activeColor: '#FFFF00', //bg color...
			inactiveColor: '#FFFF00'
		}
     });
	console.log("ENERGY: " + view.style.width/4);
	this.energyView.startValue =  view.style.width/4;

/*	this.energyView.setThumbSize = function(value) {
		if (value + this.sliderValue < view.style.width/4) {
			console.log("call super");
			this.energyView.superview.setThumbSize(value);
		}
		else {
			console.log("do nothing");
		}
	}*/

	return this.energyView;
}


exports.setupScoreView = function (view) {
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
}









	