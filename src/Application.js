import ui.View;
import ui.ImageView;
import ui.SpriteView;
import ui.ImageScaleView;
import ui.resource.loader as loader;
import ui.widget.ButtonView as ButtonView;

import math.geom.Rect as Rect;
import math.geom.Point as Point;

import animate;
import AudioManager;

import src.platformer.ParallaxView as ParallaxView;
import src.platformer.GestureView as GestureView;
import src.platformer.Physics as Physics;
import src.platformer.ScoreView as ScoreView;
import src.platformer.util as util;
import src.ApplicationExtras as extras;
import src.PlayerLogic as playerlogic;
import src.GameLayer as gamelayer;
import src.DepthLayers as DepthLayers;


import plugins.ouya.ouya as ouya;


exports = Class(GC.Application, function () {
	
	// Game constants, for easy tweaking:
	const GRAVITY = 0;
	const HOLD_GRAVITY = GRAVITY / 3;
	const JUMP_VELOCITY = 200;
	const ROLL_VELOCITY = 700;
	const PLAYER_INITIAL_SPEED = 400;
	const WORLD_ACCELERATION = 15;
	const REBOUND_PERCENTAGE = 0.3;
	const SCORE_STAR_VALUE = 100;
	const SCORE_TIME_VALUE = 1;

	this.initUI = function () {
		util.scaleRootView(this, 1024, 576);
		loader.preload(["resources/images/level", "resources/audio/effects"], function () {

		this.resetState();
		this.setupParallaxView();
		this.setupInput();
		this.player = playerlogic.setupPlayer();		
		this.sound = extras.loadSound();
		this.startGame();
		
		Physics.start();

		// this flag allows the tick function below to begin stepping.
		this.loaded = true;
		
		}.bind(this));
	}

	this.setupParallaxView = function() {
		
		this.parallaxView = new ParallaxView({
			superview: this.view,
		 	width: this.view.style.width,
		 	height: this.view.style.height,
		});
		
		this.parallaxView.addBackgroundView(new ui.ImageScaleView({
			scaleMethod: 'cover',
			image: "resources/images/level/backgroundSky.png",
		}));
	
		DepthLayers.addFarBrush(this.parallaxView);
		DepthLayers.addCloseBrush(this.parallaxView);
		DepthLayers.addWater(this.parallaxView);
		DepthLayers.addCloud(this.parallaxView);

		this.gameLayer = this.parallaxView.addLayer({
			distance: 7,
			populate: function (layer, x) {
				return gamelayer.populateGameLayer(layer, x);
			}.bind(this)

		});
	
	}

/* -------------------------------------------------------------------------------------------------------------------------------------------*/

														/*Input controls*/

/*--------------------------------------------------------------------------------------------------------------------------------------------*/
	this.onFly = function() {
		this.player.velocity.y = -1 * JUMP_VELOCITY;
		console.log('hold');
	}
	this.onFlyDone = function() {
		//this.player.style.y+=100;
	}


// We'll handle a couple gestures: swipe down, and tap-and-hold,
	// using a GestureView.
	this.setupInput = function () {
		this.gestureView = new GestureView({
			superview: this.view,
			width: this.view.style.width,
			height: this.view.style.height,
			zIndex: 10000
		});

	ouya.onDigitalInput = function(evt) {
			if (evt.code == ouya.BUTTON.O && this.lastAction != evt.action) {
				this.lastAction = evt.action;
				if (evt.action == ouya.ACTION.DOWN) {
					this.onFly();
				} else { // key up
					this.onFlyDone();
				}
			}
	}.bind(this);
	
		// When the player taps, try to jump
		this.gestureView.on("InputStart", this.onFly.bind(this));

		this.gestureView.on("InputSelect", this.onFlyDone.bind(this));
	}

/* -------------------------------------------------------------------------------------------------------------------------------------------*/

														/*Start and stop and run game*/

/*--------------------------------------------------------------------------------------------------------------------------------------------*/
	
	
	// Clear out a few variables before we start any game:
	this.resetState = function () {
		if (this.isFinished) {
			animate(this.parallaxView).commit();
		}
		this.t = 0;
		this.isFinished = false;
		this.score = 0;
	}
	
	// This code actually starts the game.
	this.startGame = function() {
		setTimeout(function () {
			// This is in a setTimeout because some desktop browsers need
			// a moment to prepare the sound (this is probably a bug in DevKit)
			this.sound.play("background");
		}.bind(this), 10);
		
		this.resetState();
		this.parallaxView.scrollTo(0, 0);
		this.parallaxView.clear();
		this.gameLayer.addSubview(this.player);
		this.player.setCollisionEnabled(true);
		this.player.style.r = 0; // he rotates when he dies
		/*this.player.startAnimation("land", {
			loop: true
		});*/
		this.player
			.setPosition(0, 0)
			//.setVelocity(PLAYER_INITIAL_SPEED, -400)
			.setAcceleration(WORLD_ACCELERATION, GRAVITY);
	};
	
	// When the player dies...
	this.finishGame = function() {
		if (!this.isFinished) {
			this.isFinished = true;
			this.sound.play("lose");
			this.player.acceleration.x = -200; // slow them down until they stop
			// Fade out the parallax layer
			animate(this.parallaxView)
				.now({opacity: 0.2}, 1000)
				.wait(10000000)
				.then({opacity: 1});
		}
	}

	this.tick = function (dtMS) {
		if (!this.loaded) {
			return;
		}
		var dt = Math.min(dtMS / 1000, 1/30); //return lowest value of these§	
		this.t += dt;
		
		if (this.isFinished) {
			if (this.player.velocity.x < 0) {
				this.player.stopAllMovement();
				this.sound.play("win");
			}
		} else {
				this.player.acceleration.y = GRAVITY;			
		}
		this.gameLayer.scrollTo(this.player.getLeft() - 50, this.player.getTop()-100);
		
		// Check for collisions with the ground:
		var hits = this.player.getCollisions("ground");
		for (var i = 0; i < hits.length; i++) {
			var hit = hits[i];
			console.log(hit);
		}	

		var hits = this.player.getCollisions("star");
		for (var i = 0; i < hits.length; i++) {
			var hit = hits[i];
			var star = hit.view;
			star.setCollisionEnabled(false);
			animate(star).now({
				scale: 0,
				dx: util.randInt(-100, 100),
				dy: util.randInt(-100, 100),
			}, 200).then(function () {star.removeFromSuperview()});
		}
		
		if (hits.length) {
			this.sound.play("star" + util.randInt(1,9));
		}

		// If they hit an ememy bee, they die.
		var hits = this.player.getCollisions("bee");
		for (var i = 0; i < hits.length; i++) {
			var hit = hits[i];
			var bee = hit.view;
			bee.setCollisionEnabled(false);
			bee.stopAllMovement();
			bee.velocity.x = this.player.velocity.x;
			bee.acceleration.y = GRAVITY;
			bee.die();
			this.player.setCollisionEnabled(false); // let him fall through the platforms
			animate(this.player).now({
				dr: Math.PI * -2
			}, 2000);
			this.finishGame();
		}

		// If the player fell off the bottom of the screen, game over!
		if (this.player.getY() >= this.gameLayer.style.height) {
			this.finishGame();
		}
	}
});





