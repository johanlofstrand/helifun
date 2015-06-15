
import ui.ImageView;
import src.platformer.util as util;

exports.addWater =function(parallaxView) {
	parallaxView.addLayer({
		distance: 4,
		populate: function (layer, x) {
			var v = layer.obtainView(ui.ImageView, {
				superview: layer,
				image: "resources/images/level/jwater.png",
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
				opacity: util.randInt(2,10)/10,
				autoSize: true
			});
			return util.randInt(200, 600);
		}
	});
}
	


