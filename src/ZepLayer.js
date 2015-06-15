import src.platformer.Physics as Physics;
import ui.View;
import ui.ImageView;
import src.platformer.util as util;
import resources.starGrids as starGrids;
import animate;
import ui.SpriteView;
import device;

exports.populateZepLayer = function(layer, x) {


	var zep = layer.obtainView(ZepView, {
				
				superview: layer,
				x: x+util.randInt(500,1000),
				y: util.randInt(0,100),
				width: 200,
				height: 60,
			}, {poolSize: 3, group: "zeps"});
		return util.randInt(1500,3500);
	}

	var ZepView = new Class([ui.View, Physics], function (supr) {
		
		this.init = function(opts) {
			opts.group = "zeps";
			opts.hitbox = {  //rather player friendly hitbox
				x: 10,
				y: 10,
				width: 200,
				height: 60,
			};
			supr(this, 'init', arguments);

			Physics.prototype.init.apply(this, arguments);

			var sprite = this.sprite = new ui.SpriteView({
				superview: this,
				width: 200,
				height: 60,
				zIndex: -100,
				//backgroundColor: "#FF0000",
				url: "resources/images/enemies/jzep1",
				defaultAnimation: "spin",
				frameRate: 4,
				autoStart: true,
			});

			function animateZep() {
			var leviation = util.randInt(0,10);
			animate(sprite)
				.clear()
				.now({dy: leviation}, 600)
				.then({dy: -leviation}, 600)
				.then(animateZep);
			}
			animateZep();

		},

		this.tick = function () {
			this.hitbox.y = this.sprite.style.y; //must update hitbox due to animation changes position all the time...
			this.hitbox.x = this.sprite.style.x;
			if (this.tick %3) this.style.x--;
		},
		
		this.die = function() {
			animate(this.sprite, "rotation")
				.now({r: Math.PI * 1.5}, 500)
				.then({dy: 400},500)
				.clear();
		}
	});
		

