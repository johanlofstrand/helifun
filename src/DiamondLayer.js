import src.platformer.Physics as Physics;
import ui.View;
import ui.ImageView;
import src.platformer.util as util;
import animate;
import ui.SpriteView;
import device;

exports.populateDiamondLayer = function(layer, x) {



	var diamondballoon = layer.obtainView(DiamondView, {
				superview: layer,
				x: x+util.randInt(500,1000),
				y: util.randInt(100,500),
				width: 80,
				height: 180
			}, {poolSize: 8, group: "diamondballoons"});
		return util.randInt(700,2400);
	}

	var DiamondView = new Class([ui.View, Physics], function (supr) {

		this.WIND_SPEED = 0.1;

		this.diatype = null;

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

			this.getSpriteName = function() {
				if (Math.random() <= 0.5) {
					this.diatype =  "greendiab";
				}
				else {
					this.diatype =  "reddiab";
				}
				console.log(this.diatype);
				return this.diatype;
			};

			var sprite = this.sprite = new ui.SpriteView({
				superview: this,
				width: 80,
				height: 180,
				url: "resources/images/diamonds/" + this.getSpriteName(),
				defaultAnimation: "spin",
				frameRate: 3,
				autoStart: true
			});
		},

		this.tick = function () {
			this.sprite.style.y--;
		//	this.sprite.style.x = this.sprite.style.x - this.WIND_SPEED;
			this.hitbox.y = this.sprite.style.y; //must update hitbox due to animation changes position all the time...
			this.hitbox.x = this.sprite.style.x;
			
			if (this.sprite.style.y < -500) { //need to recycle them when they are gone out of screen...
				//console.log("restart: " + this);
				this.sprite.style.y = util.randInt(100,500);
				//this.sprite.removeFromSuperview();
			}
			//this.WIND_SPEED+=0.0001;
		}
	});
		

