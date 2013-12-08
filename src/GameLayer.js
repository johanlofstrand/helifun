import src.platformer.Physics as Physics;
import ui.View;
import ui.ImageView;
import src.platformer.util as util;
import resources.starGrids as starGrids;

// Here's where the real work for the game layer takes place. You
	// should read through the documentation for ParallaxView to fully
	// understand this function. In short, this function gets called
	// with an `x` coordinate for the position where we should start
	// adding views to the game layer. As the player scrolls further
	// right in the game, this function will get called to add more
	// platforms and items.
	exports.populateGameLayer = function (layer, x) {
		
		// Get a new platform of a random size. (This view comes from
		// a ViewPool automatically, which improves performance.)
		var size = util.choice(['S', 'M', 'L', 'XL']);
		var mountain_height = 270;
		var space_between = util.randInt(100,600);
		var mountain = layer.obtainView(ui.ImageView, {
			superview: layer,
			image: "resources/images/level/mountain_" + size + ".png",
			x: x,
			y: layer.style.height - mountain_height,
			width: size,
			autoSize: true
		});

		// To detect collisions between the player and any platform,
		// we add Physics to this view with a group of "ground".
		Physics.addToView(mountain, {group: "ground"});

	
		var starHeight = util.randInt(50, 200);
		var starSize = 50;
		var numStars = 100 / starSize - 2;
		var maxPerRow = 200 / starSize | 0;
		var grid = util.choice(starGrids); // choose a random arrangement of stars
		var initX = util.randInt(0, Math.max(0, maxPerRow - grid[0].length)) * starSize;
		
		for (var gridY = 0; gridY < grid.length; gridY++) {
			var row = grid[gridY];
			var rowCount = Math.min(row.length, maxPerRow);
			for (var gridX = 0; gridX < rowCount; gridX++) {
				if (grid[gridY][gridX] == 0) {
					continue;
				}
				var star = layer.obtainView(ui.ImageView, {
					superview: layer,
					image: "resources/images/star.png",
					x: x + initX + gridX * starSize,
					y: 200 - starHeight - starSize * gridY,
					anchorX: starSize/2,
					anchorY: starSize/2,
					width: starSize,
					height: starSize,
					scale: 1
				}, {poolSize: 40, group: "star"}); // note the large pool size, for performance.

				// Again, we group these in a "star" group for easy collision detection processing.
				Physics.addToView(star, {group: "star"});
			}
		}
		
	
		return mountain.style.width + space_between;

	}
