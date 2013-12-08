
import ui.ImageView;
import src.platformer.util as util;

exports.addFarBrush = function(parallaxView) {

	parallaxView.addLayer({
		distance: 20,
		populate: function (layer, x) {
			var v = layer.obtainView(ui.ImageView, {
				superview: layer,
				image: "resources/images/level/fargroundBrush.png",
				x: x,
				y: layer.style.height - 250,
				opacity: 0.5,
				width: 1024,
				height: 212
			});
			return v.style.width;
		}
	});
}

exports.addCloseBrush =function (parallaxView) {
	
	parallaxView.addLayer({
		distance: 10,
		populate: function (layer, x) {
			var v = layer.obtainView(ui.ImageView, {
				superview: layer,
				image: "resources/images/level/midgroundBrush.png",
				x: x,
				y: layer.style.height - 200,
				width: 1024,
				height: 212
			});
			return v.style.width;
		}
	});		
}

exports.addWater =function(parallaxView) {
	parallaxView.addLayer({
		distance: 4,
		populate: function (layer, x) {
			var v = layer.obtainView(ui.ImageView, {
				superview: layer,
				image: "resources/images/level/waterFast.png",
				x: x,
				y: layer.style.height - 200,
				width: 1024,
				height: 50
			});
			return v.style.width;
		}
	});
}


exports.addCloud = function(parallaxView) {
	parallaxView.addLayer({
		distance: 5,
		populate: function (layer, x) {
			var size = util.choice([1,2,3,4,5]);
			var v = layer.obtainView(ui.ImageView, {
				superview: layer,
				image: "resources/images/level/cloud" + size + ".png",
				x: x,
				y: layer.style.height - util.randInt(400, 800),
				opacity: Math.random(),
				autoSize: true
			});
			return util.randInt(200, 500);
		}
	});
}
	


