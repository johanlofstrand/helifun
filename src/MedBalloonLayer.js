import src.platformer.Physics as Physics;
import ui.View;
import ui.ImageView;
import src.platformer.util as util;
import animate;
import ui.SpriteView;

exports.populateMedBalloonLayer = function(layer, x) {

	layer.obtainView(MedBalloonView, {
				superview: layer,
				x: x+util.randInt(500,1000),
				y: util.randInt(100,500),
				width: 52,
				height: 97
			}, {poolSize: 6, group: "medballoons"});
		return util.randInt(1300,3500);
	};

	var MedBalloonView = new Class([ui.View, Physics], function (supr) {
		
		this.init = function(opts) {
			opts.group = "medballoons";
			opts.hitbox = {
				x: 0,
				y: 0,
				width: 52,
				height: 97
			};
	
			supr(this, 'init', arguments);
			
			Physics.prototype.init.apply(this, arguments);

			var sprite = this.sprite = new ui.SpriteView({
				superview: this,
				width: 52,
				height: 97,
				url: "resources/images/medballoon/medballoon",
				defaultAnimation: "spin",
				frameRate: 4,
				autoStart: true
			});

			function animateMedBallon() {
			animate(sprite)
				.clear()
				.now({dx: 10}, 700)
				.then({dx: -10}, 700)
				.then(animateMedBallon);
			}
			animateMedBallon();

		};

		this.tick = function () {
			this.hitbox.y = this.sprite.style.y; //must update hitbox due to animation changes position all the time...
			this.hitbox.x = this.sprite.style.x;
			
			if (this.sprite.style.y < -500) { //need to recycle them when they are gone out of screen...
				this.sprite.style.y = util.randInt(100,500);
			}
			this.sprite.style.y--;
		};

	});