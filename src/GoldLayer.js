import src.platformer.Physics as Physics;
import ui.View;
import ui.ImageView;
import src.platformer.util as util;
import animate;
import ui.SpriteView;
import device;

exports.populateGoldLayer = function(layer, x) {


	var goldballoon = layer.obtainView(GoldView, {
				
				superview: layer,
				x: x+util.randInt(500,1000),
				y: util.randInt(0,600),
				width: 52,
				height: 97,
			}, {poolSize: 3, group: "goldballoons"});
		return util.randInt(500,3000);
	}

	var GoldView = new Class([ui.View, Physics], function (supr) {
		
		this.init = function(opts) {
			opts.group = "goldballoons";
			opts.hitbox = {  //rather player friendly hitbox
				x: 0,
				y: 0,
				width: 52,
				height: 97,
			};
			console.log("init");
			supr(this, 'init', arguments);

			Physics.prototype.init.apply(this, arguments);

			var sprite = this.sprite = new ui.SpriteView({
				superview: this,
				width: 52,
				height: 97,
				url: "resources/images/level/jgold",
				defaultAnimation: "spin",
				frameRate: 4,
				autoStart: true,
			});

			function animateGoldBallon() {
			animate(sprite)
				.clear()
				.now({dx: 10}, 700)
				.then({dx: -10}, 700)
				.then(animateGoldBallon);
			}
			animateGoldBallon();

		},
	
	
		this.tick = function () {
			this.hitbox.y = this.sprite.style.y; //must update hitbox due to animation changes position all the time...
			this.hitbox.x = this.sprite.style.x;
			this.sprite.style.y--;
		},
		
		this.die = function() {
			animate(this.sprite, "rotation")
				.now({r: Math.PI * 1.5}, 500)
				.then({dy: 400},500)
				.clear();
		}
	});
		

