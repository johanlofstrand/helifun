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
import src.InfoViews as InfoViews;
import src.PlayerLogic as playerlogic;
import src.GameLayer as gamelayer;
import src.DiamondLayer as diamondlayer;
import src.DepthLayers as DepthLayers;
import src.EnemyLayer as enemylayer;
import src.BalloonLayer as balloonlayer;
import src.GoldLayer as goldlayer;
import src.ZepLayer as zeplayer;
import event.Emitter as Emitter;

import device;


exports = Class(ui.View, function (supr) {

    const GRAVITY = 0;
    const PLAYER_INITIAL_SPEED = 150;
    const WORLD_ACCELERATION = 7;
    const SCORE_STAR = 500;
    const SCORE_TIME = 1;

    var self = this;

    this.init = function (opts) {
        console.log("GameScreen - init");
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: 1024,
            height: 680
        });

        supr(this, 'init', [opts]);

        this.build();

    };

    this.build = function() {
        this.on('app:start', this,startGame.bind(this));
        //loader.preload(["resources/images/level", "resources/audio/effects"], function () {

        this.energyView = InfoViews.setupEnergyView(this);
        this.resetState();
        this.setupParallaxView();
        //   this.setupInput();
        this.player = playerlogic.setupPlayer();
        this.sound = extras.loadSound();
        this.scoreView = InfoViews.setupScoreView(this);

        // this flag allows the tick function below to begin stepping.
        this.loaded = true;
        Physics.start();

        //})};
    };

    this.setupParallaxView = function() {

        this.parallaxView = new ParallaxView({
            superview: this.view,
            width: 1024,
            height: 680
        });

        /*	this.parallaxView.addBackgroundView(new ui.ImageScaleView({
         scaleMethod: 'cover',
         image: "resources/images/level/backgroundSky.png",
         }));
         */
        this.parallaxView.style.backgroundColor = "#87CEFA";

        DepthLayers.addWater(this.parallaxView);
        DepthLayers.addCloud(this.parallaxView);

        this.gameLayer = this.parallaxView.addLayer({
            distance: 7,
            populate: function (layer, x) {
                return gamelayer.populateGameLayer(layer, x);
            }.bind(this)

        });

        this.diamondLayer = this.parallaxView.addLayer({
            distance: 7,
            populate: function (layer, x) {
                return diamondlayer.populateDiamondLayer(layer, x);
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
        this.textView = new ui.TextView({
            superview: this.parallaxView,
            layout: 'box',
            fontFamily: 'BPreplayBold',
            text: "Game over!",
            size: 45,
            wrap: true
        });
    };


    this.balloonMessenger = new Emitter();

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
    };

    this.onFlyDone = function() {
        if (this._touchedWhenFinished && this.isFinished) {
            this._touchedWhenFinished = false;
            this.startGame();
        }
        else {
            this.player.velocity.y = 300;
        }
        //this.player.setVelocity(this.player.getVelocity(),100);
    };

    /*   this.setupInput = function () {
     this.gestureView = new GestureView({
     superview: this.view,
     width: 1024,
     height: 680,
     zIndex: 10000
     });


     this.gestureView.on("InputStart", this.onFly.bind(this));
     this.gestureView.on("InputSelect", this.onFlyDone.bind(this));
     };*/

    /* -------------------------------------------------------------------------------------------------------------------------------------------*/

    /*Start and stop and run game*/

    /*--------------------------------------------------------------------------------------------------------------------------------------------*/

    this.resetState = function () {
        if (this.isFinished) {
            animate(this.scoreView).commit();
            animate(this.parallaxView).commit();
        }
        this.t = 0;
        this.isFinished = false;
        this.score = 0;
        this.sliderValue=this.energyView.startValue;
        this.energyView.setThumbSize(this.sliderValue);
        this.no_of_gold_ballons=0;
        //	this.BalloonBoard.removeAllSubviews();

    };
});


function startGame () {

    var that = this;
    /*  setTimeout(function () {
     // This is in a setTimeout because some desktop browsers need
     // a moment to prepare the sound (this is probably a bug in DevKit)
     that.sound.play("background");
     }.bind(that), 10);*/

    that.resetState();
    that.parallaxView.scrollTo(0, 0);
    that.parallaxView.clear();

    that.textView.hide();

    that.player.setCollisionEnabled(true);
    that.player.style.r = 0;
    that.player
        .setPosition(300, 300)
        .setVelocity(PLAYER_INITIAL_SPEED, 0)
        .setAcceleration(WORLD_ACCELERATION, GRAVITY);
    that.gameLayer.addSubview(this.player);

    tick.bind(that);
}

function finishGame() {
    if (!this.isFinished) {
        this.isFinished = true;
        //this.sound.play("lose");
        this.player.acceleration.x = -400; //slow down
        animate(this.parallaxView)
            .now({opacity: 0.7}, 1000)
            .wait(10000000)
            .then({opacity: 1});
        animate(this.scoreView)
            .now({
                dy: 300
            }, 700, animate.easeIn)
            .then({scale: 2}, 400, animate.easeIn)
            .then({scale: 1}, 400, animate.easeOut)
            .then({y: 0},400)

        this.textView.show();
    }
}

function tick(dtMS) {

    console.log(tick);

    if (!this.loaded) {
        return;
    }
    var dt = Math.min(dtMS / 1000, 1/30); //return lowest value of these
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

    var hits_ground = this.player.getCollisions("ground");
    for (var i = 0; i < hits_ground.length; i++) {
        this.sound.play("alarm",{loop: false}); //play once
        console.log("hit ground");
        //animate(this.player).clear();
        this.player.setRotation(0);
        //this.player.resetAnimation();
        animate(this.player).now({dr: -1},50).then({dr: 1},50)
        this.sliderValue = this.sliderValue-0.5;
        this.energyView.setThumbSize(this.sliderValue);
    }

    var hits = this.player.getCollisions("diamondballoons");
    for (var i = 0; i < hits.length; i++) {
        this.score += SCORE_STAR;
        var hit = hits[i];
        var diaballoon = hit.view;
        diaballoon.setCollisionEnabled(false);
        diaballoon.removeFromSuperview();
        this.sound.play("star");
    }

    // If they hit an ememy plane
    var hits_p = this.player.getCollisions("planes");
    for (var i = 0; i < hits_p.length; i++) {
        var hit = hits_p[i];
        var plane = hit.view;
        this.sound.play("alarm",{loop: false}); //play once
        this.sliderValue = this.sliderValue-5;
        this.energyView.setThumbSize(this.sliderValue);
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
        this.sound.play("alarm")	; //play once
        this.sliderValue = this.sliderValue-3;
        this.energyView.setThumbSize(this.sliderValue);
        animate(this.player)
            .now({
                r: Math.PI * 2
            }, 500).
            then({r:0},1);
    }

    // If they hit a zep
    var hits_z = this.player.getCollisions("zeps");
    for (var i = 0; i < hits_z.length; i++) {
        this.sliderValue = this.sliderValue-2;
        this.sound.play("alarm",{loop: false}); //play once
        this.energyView.setThumbSize(this.sliderValue);
        animate(this.player)
            .now({r: 0.2}, 60)
            .then({r:-0.2},60)
            .then({r: 0}, 1);
    }

    // If they hit a gold balloon
    var hits_g = this.player.getCollisions("medballoons");
    for (i=0; i< hits_g.length; i++) {

        var hit = hits_g[i];
        var goldb = hit.view;
        goldb.setCollisionEnabled(false);
        goldb.removeFromSuperview();
        if (this.sliderValue < this.energyView.startValue - 10) {
            this.sliderValue = this.sliderValue+30;
        };
        this.energyView.setThumbSize(this.sliderValue);
        this.no_of_gold_ballons++;
        this.sound.play("medbox");
        this.balloonMessenger.emit('NewBalloon',this);

        /*if (this.no_of_gold_ballons>=5) {
         this.textView.setText("Grattis! Du tog 5 ballonger!");
         this.finishGame();
         }*/

    }

    // If the player fell off the bottom of the screen, game over!
    if (this.player.getY() >= this.gameLayer.style.height) {
        this.finishGame();
    }

    if (this.sliderValue<=0) {
        this.textView.setText("Game over!");
        this.finishGame();
    }
}

