import ui.ImageScaleView as ImageScaleView;
import ui.View as ui.View;
import src.platformer.ScoreView as ScoreView;

exports.setupDiamondCountView = function (view,diamondType,spaceFromEdge) {

	this.diamondView = new ImageScaleView({
		zIndex: 10000,
		autoScale: true,
		width: 37,
		height: 47,
		superview: view,
		x:view.style.width - spaceFromEdge -30,
		y:10,
		image: 'resources/images/diamonds/'+diamondType+'.png'
	});

	this.diamondCountView = new ScoreView({
		superview: view,
		zIndex: 10000,
		x: view.style.width-spaceFromEdge,
		y: 10,
		height: 40,
		width: 100,
		anchorX: view.style.width /2,
		anchorY: view.style.height,
		charWidth: 25,
		charHeight: 35,
		text: "0",
		url: 'resources/images/numbers/{}.png'
	});

	return this.diamondCountView;
};










	