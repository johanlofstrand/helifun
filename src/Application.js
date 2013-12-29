import ui.View;
import ui.ImageView as ImageView;
import ui.SpriteView;
import ui.ImageScaleView;
import ui.resource.loader as loader;
import ui.widget.ButtonView as ButtonView;
import ui.TextView;

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
import src.StarLayer as starlayer;
import src.DepthLayers as DepthLayers;
import src.EnemyLayer as enemylayer;
import src.BalloonLayer as balloonlayer;
import src.GoldLayer as goldlayer;
import src.ZepLayer as zeplayer;

import device;


import plugins.ouya.ouya as ouya;


exports = Class(GC.Application, function () {
	
	// Game constants, for easy tweaking:
	const GRAVITY = 0;
	const HOLD_GRAVITY = GRAVITY / 3;
	const JUMP_VELOCITY = 200;
	const ROLL_VELOCITY = 700;
	const PLAYER_INITIAL_SPEED = 150;
	const WORLD_ACCELERATION = 10;
	const REBOUND_PERCENTAGE = 0.3;
	const SCORE_STAR = 100;
	const SCORE_TIME = 1;

	this.initUI = function () {
		util.scaleRootView(this, 1024, 680);
		loader.preload(["resources/images/level", "resources/audio/effects"], function () {

		this.resetState();
		this.setupParallaxView();
		this.setupInput();
		this.player = playerlogic.setupPlayer();		
		this.sound = extras.loadSound();
		this.scoreView = extras.setupScoreView(this);
		this.sliderView = extras.setupSliderView(this);
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

		this.starLayer = this.parallaxView.addLayer({
			distance: 7,
			populate: function (layer, x) {
				return starlayer.populateStarLayer(layer, x);
			}.bind(this)

		});


		this.enemyLayer = this.parallaxView.addLayer({
			distance: 7,
			populate: function (layer, x) {
				return enemylayer.populateEnemyLayer(layer, x);
			}.bind(this)

		});

		this.balloonLayer = this.parallaxView.addLayer({
			distance: 7,
			populate: function (layer, x) {
				return balloonlayer.populateBalloonLayer(layer, x);
			}.bind(this)

		});


		this.goldLayer = this.parallaxView.addLayer({
			distance: 7,
			populate: function (layer, x) {
				return goldlayer.populateGoldLayer(layer, x);
			}.bind(this)

		});

		this.zepLayer = this.parallaxView.addLayer({
			distance: 7,
			populate: function (layer, x) {
				return zeplayer.populateZepLayer(layer, x);
			}.bind(this)

		});
		//this.gameLayer.addSubview(this.enemylayer);
	
	}

/* -------------------------------------------------------------------------------------------------------------------------------------------*/

														/*Input controls*/

/*--------------------------------------------------------------------------------------------------------------------------------------------*/
	this.onFly = function() {
		if (!this.isFinished) {
			this.player.velocity.y = -500;
			//	this.player.setAcceleration(this.player.getAcceleration);
		}
		else {
			this._touchedWhenFinished = true; //player touched to start over... 
		}
	}
	this.onFlyDone = function() {
		if (this._touchedWhenFinished && this.isFinished) {
			this._touchedWhenFinished = false;
			this.startGame();
		}
		else { 
			this.player.velocity.y = 300;
		}
		//this.player.setVelocity(this.player.getVelocity(),100);
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
			animate(this.scoreView).commit();
			animate(this.parallaxView).commit();			
		}
		this.t = 0;
		this.isFinished = false;
		this.score = 0;
		this.sliderValue=this.view.style.width/3;
		this.sliderValueStart = this.sliderValue;
		//this.sliderView.setThumbSize(this.sliderValue);
		this.no_of_gold_ballons=0;
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
	
		this.player.setCollisionEnabled(true);
		this.player.style.r = 0; // he rotates when he dies
		this.player
			.setPosition(300, 300)
			.setVelocity(PLAYER_INITIAL_SPEED, 0)
			.setAcceleration(WORLD_ACCELERATION, GRAVITY);
				this.gameLayer.addSubview(this.player);
	};
	
	this.finishGame = function() {
		if (!this.isFinished) {
			this.isFinished = true;
			//this.sound.play("lose");
			this.player.acceleration.x = -400; // slow them down until they stop
			animate(this.parallaxView)
				.now({opacity: 0.2}, 1000)
				.wait(10000000)
				.then({opacity: 1});
			animate(this.scoreView)
				.now({
					dy: 300 
				}, 700, animate.easeIn)
				.then({scale: 2}, 400, animate.easeIn)
				.then({scale: 1}, 400, animate.easeOut)
				.then({y: 0},400)
			//Rerun symbol...
			//console.log("show rerun view: parallaxView.x: "+ this.parallaxView.style.x + " parallaxView.y: " + this.parallaxView.style.y);
			/*this.rerunView = new ImageView({
			    superview: this.parallaxView,
			  	zIndex: 10000,
				x: this.parallaxView.style.width / 2,  //margin to get right of scoreView
				y: this.parallaxView.style.height / 5,
				width: 150,
				height: 150,
			    image: "resources/images/jrerun.png"
			});
			this.parallaxView.addSubview(this.rerunView);*/
			/*this.tV = new ui.TextView({
			      superview: this.parallaxView,
			      layout: 'box',
			      fontFamily: 'BPreplayBold',
			      text: "Game over!",
			      size: 45,
			      wrap: true
			    });*/
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
		} 
		else {
			this.player.acceleration.y = GRAVITY;
			this.score += SCORE_TIME;			
		
			this.gameLayer.scrollTo(this.player.getLeft() - 300, 
								Math.min(0, this.player.getTop() - this.gameLayer.style.height / 4));
			this.scoreView.setText(this.score | 0);
		}

		var hits_g = this.player.getCollisions("ground");
		for (var i = 0; i < hits_g.length; i++) {
			var hit = hits_g[i];
			console.log("Ground");
			animate(this.player).clear();											
			this.player.setRotation(0);
			this.player.resetAnimation();
			this.sliderValue = this.sliderValue-0.5;
        	this.sliderView.setThumbSize(this.sliderValue);
		}	

		var hits = this.player.getCollisions("star");
		for (var i = 0; i < hits.length; i++) {
			this.score += SCORE_STAR;
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

		// If they hit an ememy plane
		var hits_p = this.player.getCollisions("planes");
		for (var i = 0; i < hits_p.length; i++) {
			var hit = hits_p[i];
			var plane = hit.view;
			this.sliderValue = this.sliderValue-5;
        	this.sliderView.setThumbSize(this.sliderValue);
			animate(this.player)
				.now({
					dr: Math.PI * -2
				}, 500).
				then({r:0}, 1);

				//console.log("finishGame");
			//this.finishGame();  //will finish anyway, ground rule
		}

		// If they hit an balloon
		var hits_b = this.player.getCollisions("balloons");
		for (var i = 0; i < hits_b.length; i++) {
			this.sliderValue = this.sliderValue-2;
        	this.sliderView.setThumbSize(this.sliderValue);
			animate(this.player)
				.now({
					r: Math.PI * 2
				}, 500).
				then({r:0},1);
		}

		// If they hit a zep
		var hits_z = this.player.getCollisions("zeps");
		for (var i = 0; i < hits_z.length; i++) {
			this.sliderValue = this.sliderValue-1;
        	this.sliderView.setThumbSize(this.sliderValue);
			animate(this.player)
				.now({r: 0.2}, 60)
				.then({r:-0.2},60)
				.then({r: 0}, 1);
		}

		// If they hit a gold balloon
		var hits_g = this.player.getCollisions("goldballoons");
		for (var i = 0; i < hits_g.length; i++) {
			if (this.sliderValue < this.sliderValueStart - 5) {
				this.sliderValue = this.sliderValue+5;
			};
        	this.sliderView.setThumbSize(this.sliderValue);
        	this.no_of_gold_ballons++;
        	if (this.no_of_gold_ballons>=3) {
        		console.log("win!")
        		//sänd meddelande att landingsbana ska komma? //slutskärm??
        	}
		}

			

		// If the player fell off the bottom of the screen, game over!
		if (this.player.getY() >= this.gameLayer.style.height) {
			this.finishGame();
		}

		if (this.sliderValue<=0) {
			this.finishGame();
		}
	}
});

