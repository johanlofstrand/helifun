import src.platformer.Physics as Physics;
import ui.View;
import ui.ImageView;
import src.platformer.util as util;
import resources.starGrids as starGrids;
import animate;
import ui.SpriteView;
import ui.resource.Image as Image;

	exports.populateGameLayer = function (layer, x) {
		
		var yfactor = 30;
		var yspread_tree = util.randInt(5,10);
		var size = util.choice(['S', 'M', 'L', 'XL']);
		var space_between = util.randInt(200,600);
		var img = new Image({url: "resources/images/level/mountain_" + size + ".png"});
		var mountain_height = img.getHeight();
		var mountain = layer.obtainView(ui.ImageView, {
			superview: layer,
			image: img,
			x: x+550,
			y: layer.style.height -mountain_height - yfactor,
			width: size,
			autoSize: true
		});

		Physics.addToView(mountain, {group: "ground"});

		if (util.randInt(1,3) === 1) {
			var tree = layer.obtainView(ui.ImageView, {
				superview: layer,
				image: "resources/images/level/jtree1.png",
				x: x + 550 + util.randInt(40, 150),
				y: layer.style.height - 40 - mountain_height -  yfactor - yspread_tree,
				autoSize: true	 //image size = view size
			});
		}

		return mountain.style.width + space_between;

	}
