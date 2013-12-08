import ui.View;
import ui.SpriteView;
import src.platformer.Physics as Physics;

var EnemyBeeView = new Class([ui.View, Physics], function (supr) {
	this.init = function(opts) {
		opts.group = "bee";
		opts.hitbox = {
			x: 10,
			y: 10,
			width: 30,
			height: 30,
		};
		supr(this, 'init', arguments);
		Physics.prototype.init.apply(this, arguments);
		var sprite = this.sprite = new ui.SpriteView({
			superview: this,
			x: 0,
			y: 0,
			width: 50,
			height: 50,
			url: "resources/images/enemies/bee",
			defaultAnimation: "flying",
			autoStart: true,
		});
		function animateBee() {
			animate(sprite)
				.clear()
				.now({dy: 50}, 400)
				.then({dy: -50}, 400)
				.then(animateBee);
		}
		animateBee();
	}
	
	this.tick = function () {
		this.hitbox.y = this.sprite.style.y + 10;
	}
	
	this.die = function() {
		animate(this.sprite, "rotation").now({r: Math.PI * 1.5}, 1000);
	}
});