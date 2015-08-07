import src.platformer.Physics as Physics;
import ui.SpriteView;

exports.setupPlayer = function () {
	var player = new ui.SpriteView({
		zIndex: 1,
		x: 0,
		y: 350,
		anchorX: 70,
		anchorY: 35,
		width: 135,
		height: 70,
		url: 'resources/images/avatarHelicopter/h',
		defaultAnimation: 'fly',
		autoStart: true
	});

	Physics.addToView(player, {
		hitbox: {
			x: 0,
			y: 20,
			width: 130,
			height: 60
		}
	});
	return player;
};
	