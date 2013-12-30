import ui.ImageScaleView as ImageScaleView;
import ui.widget.SliderView as SliderView;
import src.platformer.ScoreView as ScoreView;

exports.setupEnergyView = function(view) {

	this.energyView = new SliderView({
		superview: view,
		x: 0,
		y: 0,
		width: view.style.width/3,
		height: 25,
		  offsetX: view.style.width/10,
		offsetY: 10,
		thumbSize: view.style.width/3,
		active: true,
		track: {
			activeColor: '#FFFFFF' 
		},
		thumb: {
			activeColor: '#FFFF00', //bg color...
			inactiveColor: '#FFFF00',
		}
     });
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
		url: 'resources/images/numbers/char-{}.png',
	});
	return this.scoreView;
}









	