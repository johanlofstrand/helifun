import src.platformer.Physics as Physics;
import ui.View;
import ui.ImageView;
import src.platformer.util as util;
import resources.starGrids as starGrids;
import animate;
import ui.SpriteView;
import device;

exports.populateEnemyLayer = function(layer, x) {


	var enemyPlane = layer.obtainView(EnemyAirplaneView, {
				
				superview: layer,
				x: x+1000,
				y: util.randInt(0,100),
				width: 124,
				height: 60,
			}, {poolSize: 3, group: "planes"});
		console.log("optainView");
		return util.randInt(2000,10000);
	}

	var EnemyAirplaneView = new Class([ui.View, Physics], function (supr) {
		
		this.init = function(opts) {
			opts.group = "planes";
			opts.hitbox = {  //rather player friendly hitbox
				x: 10,
				y: 10,
				width: 100,
				height: 50,
			};
			console.log("init");
			supr(this, 'init', arguments);

			Physics.prototype.init.apply(this, arguments);

			var sprite = this.sprite = new ui.SpriteView({
				superview: this,
				width: 124,
				height: 60,
				url: "resources/images/enemies/jairplane1",
				defaultAnimation: "fly",
				autoStart: true,
			});

		},
	

		 this.onObtain = function() {
       		console.log("x: " + this.style.x + " y: " + this.style.y + "offsetX: " + this.style.offsetX + "offsetY: " + this.style.offsetY);
        	console.log('onObtain');
        	//this.updateOpts(y=50);
        	//this.setTopLeft(100);
        	//this.setTopRight(100);
     		this.sprite.style.visible=true;
     	},

    	this.onRelease = function() {
        	//console.log("x: " + this.style.x + " y: " + this.style.y + "offsetX: " + this.style.offsetX + "offsetY: " + this.style.offsetY);
        	console.log('view released!');
    	},
	
		this.tick = function () {
			this.hitbox.y = this.sprite.style.y; //must update hitbox due to animation changes position all the time...
			this.hitbox.x = this.sprite.style.x;
			this.style.y++;	
			this.style.x = this.style.x - 2;
			 //console.log("x: " + this.sprite.style.x + "y: " + this.sprite.style.y);
		},
		
		this.die = function() {
			animate(this.sprite, "rotation")
				.now({r: Math.PI * 1.5}, 500)
				.then({dy: 400},500)
				.clear();
		}
	});
		

