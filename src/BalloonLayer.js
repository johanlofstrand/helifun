import src.platformer.Physics as Physics;
import ui.View;
import ui.ImageView;
import src.platformer.util as util;
import resources.starGrids as starGrids;
import animate;
import ui.SpriteView;
import device;

exports.populateBalloonLayer = function(layer, x) {


	var balloon = layer.obtainView(BalloonView, {
				
				superview: layer,
				x: x+util.randInt(500,1000),
				y: util.randInt(0,200),
				width: 120,
				height: 195,
			}, {poolSize: 3, group: "balloons"});
		return util.randInt(1200,2500);
	}

	var BalloonView = new Class([ui.View, Physics], function (supr) {
		
		this.init = function(opts) {
			opts.group = "balloons";
			opts.hitbox = {  //rather player friendly hitbox
				x: 10,
				y: 10,
				width: 120,
				height: 195,
			};
			supr(this, 'init', arguments);

			Physics.prototype.init.apply(this, arguments);

			var sprite = this.sprite = new ui.SpriteView({
				superview: this,
				width: 120,
				height: 195,
				url: "resources/images/enemies/jballoon",
				defaultAnimation: "spin",
				frameRate: 4,
				autoStart: true,
			});

			function animateBalloon() {
			animate(sprite)
				.clear()
				.now({dy: 50}, 700)
				.then({dy: -50}, 700)
				.then(animateBalloon);
			}
			animateBalloon();

		},
	
	
		this.tick = function () {
			this.hitbox.y = this.sprite.style.y; //must update hitbox due to animation changes position all the time...
			this.hitbox.x = this.sprite.style.x;
		},
		
		this.die = function() {
			animate(this.sprite, "rotation")
				.now({r: Math.PI * 1.5}, 500)
				.then({dy: 400},500)
				.clear();
		}
	});
		

