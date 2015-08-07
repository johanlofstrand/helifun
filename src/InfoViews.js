import ui.ImageScaleView as ImageScaleView;
import ui.widget.SliderView as SliderView;
import src.platformer.ScoreView as ScoreView;


exports.setupEnergyView = function(view) {
	this.energyView = new SliderView({
		superview: view,
		x: 0,
		y: 10,
		width: view.style.width/4,
		height: 25,
		zIndex: 10000,
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
	this.energyView.startValue =  view.style.width/4;
	this.energyView.actualValue = this.energyView.startValue;

	this.energyView.energyUpdate = function(energyPlus) {
		this.actualValue = this.actualValue + energyPlus;
		if (this.actualValue >= this.startValue) {
			this.actualValue = this.startValue;
		}
		this.setThumbSize(this.actualValue);
	};

	return this.energyView;
};


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
		url: 'resources/images/numbers/{}.png'
	});
	return this.scoreView;
}









	