import src.platformer.Physics as Physics;
import ui.View;
import ui.ImageView;
import src.platformer.util as util;
import animate;
import ui.SpriteView;

exports.populatePlaneLayer = function(layer, x) {

	layer.obtainView(AirplaneView, {
				
				superview: layer,
				x: x+1000,
				y: util.randInt(0,100),
				width: 124,
				height: 60
			}, {poolSize: 3, group: "planes"});
		return util.randInt(2000,10000);
	};

	var AirplaneView = new Class([ui.View, Physics], function (supr) {
		
		this.init = function(opts) {
			opts.group = "planes";
			opts.hitbox = {  //rather player friendly hitbox
				x: 10,
				y: 10,
				width: 100,
				height: 50
			};
			supr(this, 'init', arguments);

			Physics.prototype.init.apply(this, arguments);

			this.sprite = new ui.SpriteView({
				superview: this,
				width: 124,
				height: 60,
				url: "resources/images/enemies/jairplane1",
				defaultAnimation: "fly",
				autoStart: true
			});

		};

		this.tick = function () {
			this.hitbox.y = this.sprite.style.y; //must update hitbox due to animation changes position all the time...
			this.hitbox.x = this.sprite.style.x;
			this.style.y++;	
			this.style.x = this.style.x - 2;
		};
	});

		

