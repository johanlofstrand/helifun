import device;
import ui.View;
import src.platformer.Physics as Physics;
import ui.SpriteView;

	// Load the player's sprite. Take a look at the resources directory
	// to see what these images look like and how they fit together to
	// form a SpriteView.
	exports.setupPlayer = function () {
		this.player = new ui.SpriteView({
			zIndex: 1,
			x: 0,
			y: 350,
			anchorX: 70,
			anchorY: 35,
			offestX: 70,
			offsetY: 35,
			width: 135,
			height: 70,
			url: 'resources/images/avatarHelicopter/heli',
			defaultAnimation: 'fly',
			autoStart: true,
		});
		
		// This player needs to be able to move with physics.
		// This function will give the player a bunch of new
		// functionality like velocity, acceleration, and
		// a bunch of positioning helper functions.
		// See the Physics class documentation!
		Physics.addToView(this.player, {
			hitbox: {
				x: 0,
				y: 20,
				width: 130,
				height: 60,
			}
		});
		return this.player;
	}
	