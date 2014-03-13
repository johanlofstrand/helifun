import src.platformer.Physics as Physics;
import ui.View;
import ui.ImageView;
import src.platformer.util as util;
import animate;
import ui.SpriteView;
import device;

exports.populateGoldLayer = function(layer, x) {

	var spriteid=1;

	var goldballoon = layer.obtainView(GoldView, {
				superview: layer,
				x: x+util.randInt(500,1000),
				y: util.randInt(100,500),
				width: 52,
				height: 97,
			}, {poolSize: 8, group: "goldballoons"});
		return util.randInt(700,2400);
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
	
		this.onObtain = function() {
			this.setCollisionEnabled(true);
			//console.log("GOLD obtain");
		}
	
		this.tick = function () {
			this.hitbox.y = this.sprite.style.y; //must update hitbox due to animation changes position all the time...
			this.hitbox.x = this.sprite.style.x;
			
			if (this.sprite.style.y < -500) { //need to recycle them when they are gone out of screen...
				//console.log("restart: " + this);
				this.sprite.style.y = util.randInt(100,500);
				//this.sprite.removeFromSuperview();	
			}
			this.sprite.style.y--;
		},
		
		this.die = function() {
			animate(this.sprite, "rotation")
				.now({r: Math.PI * 1.5}, 500)
				.then({dy: 400},500)
				.clear();
		}
	});
		

