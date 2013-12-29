import src.platformer.Physics as Physics;
import ui.View;
import ui.ImageView;
import src.platformer.util as util;
import resources.starGrids as starGrids;
import animate;
import ui.SpriteView;

	exports.populateGameLayer = function (layer, x) {
		
		var yspread = util.randInt(15,35);

		var size = util.choice(['S', 'M', 'L', 'XL']);
		var mountain_height = 110;
		var space_between = util.randInt(100,600);
		var mountain = layer.obtainView(ui.ImageView, {
			superview: layer,
			image: "resources/images/level/mountain_" + size + ".png",
			x: x+550,
			y: layer.style.height - 50 -mountain_height - yspread,
			width: size,
			autoSize: true
		});

		Physics.addToView(mountain, {group: "ground"});

		var tree = layer.obtainView(ui.ImageView, {
			superview: layer,
			image: "resources/images/level/jtree1.png",
			x: x + 550 + util.randInt(10,100),
			y: layer.style.height - 50 - mountain_height - yspread,
			width: 100,
			height: 100,		
			autoSize: true
		});

		return mountain.style.width + space_between;

	}
