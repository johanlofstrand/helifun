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


import src.platformer.Physics as Physics;
import src.platformer.ScoreView as ScoreView;
import src.platformer.util as util;
import src.ApplicationExtras as extras;
import src.InfoViews as InfoViews;
import src.PlayerLogic as playerlogic;


import src.ParallaxLayer as ParallaxLayer;
import event.Emitter as Emitter;

import src.platformer.GestureView as GestureView;


import device;


exports = Class(ui.View, function (supr) {

    this.boundsWidth = 1000;
    this.boundsHeight = 760;
    this.baseWidth = device.screen.width * (this.boundsHeight / device.screen.height); //864
    this.baseHeight = this.boundsHeight; //576
    this.scale = device.screen.height / this.baseHeight; //1

    this.GRAVITY = 0;
    this.PLAYER_INITIAL_SPEED = 150;
    this.WORLD_ACCELERATION = 7;
    this.SCORE_STAR = 500;
    this.SCORE_TIME = 1;
    this.MAX_HEIGHT = -500;

    var self = this;

    this.init = function (opts) {
        opts = merge(opts, {
            width: this.baseWidth,
            height: this.baseHeight,
            x: 0,
            y: 0,
            scale: 1
        });

        supr(this, 'init', [opts]);

        self.textView = new ui.TextView({
            superview: this,
            layout: 'box',
            fontFamily: 'BPreplayBold',
            text: "Game over!",
            size: 45,
            wrap: true
        });
        self.scoreView = InfoViews.setupScoreView(this);
        this.build();

        this.gestureView = new GestureView({
            superview: this,
            width: this.baseWidth,
            height: this.baseHeight,
            zIndex: 10000
        });

        this.gestureView.on("InputStart", this.onFly.bind(this));
        this.gestureView.on("InputSelect", this.onFlyDone.bind(this));

        this.balloonMessenger = new Emitter();
    };

    this.build = function() {
        this.on('app:start', resetState.bind(this));
        loader.preload(["resources/images/level", "resources/audio/effects"], function () {

            this.energyView = InfoViews.setupEnergyView(this);

            self.parallaxView = new ParallaxLayer(this);
            this.addSubview(this.parallaxView );

            self.player = playerlogic.setupPlayer();

            this.sound = extras.loadSound();


        }.bind(this));
    };



    /* -------------------------------------------------------------------------------------------------------------------------------------------*/

    /*Input controls*/

    /*--------------------------------------------------------------------------------------------------------------------------------------------*/
    this.onFly = function() {
        if (!self.isFinished) {
            self.player.velocity.y = -500;
            //	this.player.setAcceleration(this.player.getAcceleration);
        }
        else {
            self._touchedWhenFinished = true; //player touched to start over...
        }
    };

    this.onFlyDone = function() {
        if (self._touchedWhenFinished && self.isFinished) {
            self._touchedWhenFinished = false;
            //this.emit("gamescreen:end");
        }
        else {
            self.player.velocity.y = 300;

        }
        //this.player.setVelocity(this.player.getVelocity(),100);
    };

    this.finishGame = function() {
        if (!this.isFinished) {
            this.isFinished = true;
            //this.sound.play("lose");
            self.player.acceleration.x = -400; //slow down
            self.textView.show();
            animate(self.parallaxView)
                .now({opacity: 0.7}, 1000)
                .wait(10000000)
                .then({opacity: 1});
          /*  animate(self.scoreView)
                .now({
                    dy: 300
                }, 700, animate.easeIn)
                .then({scale: 2}, 400, animate.easeIn)
                .then({scale: 1}, 400, animate.easeOut)
                .then({y: 0},400)*/



        }
    }


    /* -------------------------------------------------------------------------------------------------------------------------------------------*/

    /*Start and stop and run game*/

    /*--------------------------------------------------------------------------------------------------------------------------------------------*/
});




function resetState() {
    var that = this;
    if (that.isFinished) {
        animate(that.scoreView).commit();
        animate(that.parallaxView).commit();
    }
    that.t = 0;
    that.isFinished = false;
    that.score = 0;
    that.sliderValue=that.energyView.startValue;
    that.energyView.setThumbSize(this.sliderValue);
    that.no_of_gold_ballons=0;
    //	this.BalloonBoard.removeAllSubviews();
    startGame.call(that);

};



function startGame () {
    setTimeout(function () {
        // This is in a setTimeout because some desktop browsers need
        // a moment to prepare the sound (this is probably a bug in DevKit)
        this.sound.play("background");
    }.bind(this), 10);

    this.parallaxView.scrollTo(0, 0);
    this.parallaxView.scrollTo(0, 0);
    this.parallaxView.clear();

    this.textView.hide();

    this.player.setCollisionEnabled(true);
    this.player.style.r = 0;
    this.player
        .setPosition(300, 300)
        .setVelocity(this.PLAYER_INITIAL_SPEED, 0)
        .setAcceleration(this.WORLD_ACCELERATION, this.GRAVITY);
    this.parallaxView.gameLayer.addSubview(this.player);
    // this flag allows the tick function below to begin stepping.
    Physics.start();
    this.loaded = true;

    var dt = Math.min(this.dtMS / 1000, 1/30); //return lowest value of these
    this.t += dt;

    var i = setInterval(tick.bind(this), dt);
    tick.bind(this);
}



function tick(dtMS) {

    var dt = Math.min(dtMS / 1000, 1/30); //return lowest value of these
    this.t += dt;

    if (!this.loaded) {
        return;
    }

    if (this.isFinished) {
        if (this.player.velocity.x < 0) {
            this.player.stopAllMovement();
            this.sound.play("win");
        }
    }
    else {
        this.player.acceleration.y = this.GRAVITY;
        this.score += this.SCORE_TIME;

        this.parallaxView.gameLayer.scrollTo(this.player.getLeft() - 300,
            Math.min(0, this.player.getTop() - this.parallaxView.gameLayer.style.height / 4));
        this.scoreView.setText(this.score | 0);
        this.score += this.SCORE_TIME;


    }

    var hits_ground = this.player.getCollisions("ground");
    for (var i = 0; i < hits_ground.length; i++) {
        this.sound.play("alarm",{loop: false}); //play once
        //animate(this.player).clear();
        this.player.setRotation(0);
        //this.player.resetAnimation();
        animate(this.player).now({dr: -1},50).then({dr: 1},50)
        this.sliderValue = this.sliderValue-0.5;
        this.energyView.setThumbSize(this.sliderValue);
    }

    var hits = this.player.getCollisions("diamondballoons");
    for (var i = 0; i < hits.length; i++) {
        this.score += this.SCORE_STAR;
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
        this.sliderValue = this.sliderValue-this.energyView.startValue/1000;
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
        this.sliderValue = this.sliderValue - this.energyView.startValue/1000;
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
        this.sliderValue = this.sliderValue-this.energyView.startValue/1000;
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
        this.sliderValue = this.sliderValue+(this.energyView.startValue/1000)*1.5;
        this.energyView.setThumbSize(this.sliderValue);
        this.no_of_gold_ballons++;
        this.sound.play("medbox");
        // this.balloonMessenger.emit('NewBalloon',this);

    }

    // If the player fell off the bottom of the screen, game over!
    if (this.player.getY() >= this.parallaxView.gameLayer.style.height) {
        this.textView.setText("Game over!");
        this.finishGame();
    }

    if (this.sliderValue<=0) {
        this.textView.setText("Game over!");
        this.finishGame();
    }
    if (this.player.getY() <= this.MAX_HEIGHT) {
        this.player.velocity.y = 500;
    }

}

