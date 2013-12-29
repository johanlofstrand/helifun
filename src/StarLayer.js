import src.platformer.Physics as Physics;
import ui.View;
import ui.ImageView;
import src.platformer.util as util;
import resources.starGrids as starGrids;


var starno = 0;

exports.populateStarLayer = function (layer, x) {

	var starSize = 50;
	var starHeight = 200; //util.randInt(50, 200);
	if (starno > 4) {
		starno = 0;
	}
	var grid = starGrids[starno++];	
	for (var gridY = 0; gridY < grid.length; gridY++) {
		var row = grid[gridY];
		for (var gridX = 0; gridX < row.length; gridX++) {
			if (grid[gridY][gridX] == 0) {
				continue;
			}	

			var star = layer.obtainView(ui.ImageView, {
				superview: layer,
				image: "resources/images/star.png",
				x: x + 0 + gridX * starSize,
				y: 450 - starHeight - starSize * gridY,
				anchorX: starSize/2,
				anchorY: starSize/2,
				width: starSize,
				height: starSize,
				scale: 1
			}, {poolSize: 52, group: "stars"}); 

			Physics.addToView(star, {group: "star"});
		}
	}

	return 1500;
}