
import ui.ImageView;
import src.platformer.util as util;

exports.addFarBrush = function(parallaxView) {

	parallaxView.addLayer({
		distance: 15,
		populate: function (layer, x) {
			var v = layer.obtainView(ui.ImageView, {
				superview: layer,
				//image: "resources/images/level/jbush_base1.png",
				image: "resources/images/level/jmountain1.png",
				x: x,
				y: 470,
				width: 1000,
				height: 125
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
				//image: "resources/images/level/jbush_base2.png",
				image: "resources/images/level/midgroundBrush.png",
				x: x,
				y: 550,
				width: 1000,
				height: 100
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
				//backgroundColor: "#0000FF",
				y: 630,
				width: 1200,
				opacity: 0.8,
				height: 100
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
				image: "resources/images/level/jcloud" + size + ".png",
				x: x,
				y: util.randInt(0, 200),
				opacity: Math.random(),
				autoSize: true
			});
			return util.randInt(200, 500);
		}
	});
}
	


