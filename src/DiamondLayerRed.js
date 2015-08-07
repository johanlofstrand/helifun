import src.platformer.Physics as Physics;
import ui.View;
import ui.ImageView;
import src.platformer.util as util;
import animate;
import ui.SpriteView;

exports.populateDiamondLayer = function(layer, x) {

	layer.obtainView(DiamondViewRed, {
				superview: layer,
				x: x+util.randInt(500,1200),
				y: util.randInt(120,500),
				width: 80,
				height: 180
			}, {poolSize: 3, group: "diamondballoons"});
		return util.randInt(900,2700);
	};

	var DiamondViewRed = new Class([ui.View, Physics], function (supr) {

		this.diatype = "reddiab";

		this.init = function(opts) {
			opts.group = "diamondballoons";
			opts.hitbox = {
				x: 0,
				y: 0,
				width: 100,
				height: 200
			};
	
			supr(this, 'init', arguments);
			
			Physics.prototype.init.apply(this, arguments);

			 this.sprite = new ui.SpriteView({
				superview: this,
				width: 80,
				height: 180,
				url: "resources/images/diamonds/reddiab",
				defaultAnimation: "spin",
				frameRate: 3,
				autoStart: true
			});
		};

		this.tick = function () {
			this.sprite.style.y--;
			this.hitbox.y = this.sprite.style.y;
			this.hitbox.x = this.sprite.style.x;
			
			if (this.sprite.style.y < -500) {
				this.sprite.style.y = util.randInt(100,500);
			}
		}
	});