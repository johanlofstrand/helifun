import ui.View;
import ui.ImageView as ImageView;
import ui.SpriteView;
import ui.ImageScaleView;
import ui.resource.loader as loader;
import ui.TextView;
import math.geom.Rect as Rect;
import math.geom.Point as Point;
import animate;
import AudioManager;

import src.platformer.Physics as Physics;
import src.platformer.ScoreView as ScoreView;
import src.platformer.util as util;
import src.Sounds as Sounds;
import src.InfoViews as InfoViews;
import src.PlayerLogic as playerlogic;
import src.DiamondCountBoard as DiamondCountBoard;
import src.ParallaxLayer as ParallaxLayer;
import event.Emitter as Emitter;
import src.platformer.GestureView as GestureView;


exports = Class(ui.View, function (supr) {

    this.GRAVITY = 0;
    this.PLAYER_INITIAL_SPEED = 150;
    this.WORLD_ACCELERATION = 9;
    this.SCORE_TIME = 1;
    this.MAX_HEIGHT = -400;


    this.init = function (opts) {

        opts = merge(opts, {
            width: opts.width,
            height: opts.height,
            x: 0,
            y: 0,
            scale:1
        });

        supr(this, 'init', [opts]);

        this.textView = new ui.TextView({
            superview: this,
            layout: 'box',
            fontFamily: 'BPreplayBold',
            text: "Game over!",
            size: 45,
            wrap: true
        });

        this._scoreView = InfoViews.setupScoreView(this);
        this.diamondCountViewGreen = DiamondCountBoard.setupDiamondCountView(this,'greendia',200);
        this.diamondCountViewRed = DiamondCountBoard.setupDiamondCountView(this,'reddia',350);

        this.gestureView = new GestureView({
            superview: this,
            width: opts.width,
            height: opts.height,
            zIndex: 10000
        });

        this.gestureView.on("InputStart", this.onFly.bind(this));
        this.gestureView.on("InputSelect", this.onFlyDone.bind(this));

        this.on('app:start', resetState.bind(this));
        loader.preload(["resources/images/level", "resources/audio/effects"], function () {
            this.energyView = InfoViews.setupEnergyView(this);
            this.parallaxView = new ParallaxLayer({width: opts.width, height: opts.height});
            this.addSubview(this.parallaxView );
            this.player = playerlogic.setupPlayer();
            this.sound = Sounds.loadSound();
        }.bind(this));

    };


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
            setTimeout(this.emit("app:start"), 1000);
        }
        else {
            this.player.velocity.y = 300;

        }
        //this.player.setVelocity(this.player.getVelocity(),100);
    };

    /* -------------------------------------------------------------------------------------------------------------------------------------------*/

    /*Start and stop and run game*/

    /*--------------------------------------------------------------------------------------------------------------------------------------------*/
});


function resetState() {
    var that = this;
    if (that.isFinished) {
        animate(that._scoreView).commit();
        animate(that.parallaxView).commit();
    }
    that.t = 0;
    that.isFinished = false;
    that.score = 0;
    that.no_of_green_diamonds = 0;
    that.no_of_red_diamonds = 0;
    that.energyView.energyUpdate(10000);
    that.no_of_gold_ballons=0;
    startGame.call(that);
}

function startGame () {
    this.sound.stop("start");
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
    this.parallaxView.groundLayer.addSubview(this.player);
    // this flag allows the tick function below to begin stepping.
    Physics.start();
    this.loaded = true;

    var dt = Math.min(this.dtMS / 1000, 1/30); //return lowest value of these
    this.t += dt;

    this.tickInterval = setInterval(tick.bind(this), dt);
    tick.bind(this);
}

function tick(dtMS) {

    if (!this.loaded) {
        return;
    }

    if (this.isFinished) {
        if (this.player.velocity.x < 0) {
            this.player.stopAllMovement();
            this.sound.stop("background");
            this.sound.play("start");
        }
    }
    else {
        this.player.acceleration.y = this.GRAVITY;
        this.score += this.SCORE_TIME;

        this.parallaxView.groundLayer.scrollTo(this.player.getLeft() - 300,
            Math.min(0, this.player.getTop() - this.parallaxView.groundLayer.style.height / 4));
        this._scoreView.setText(this.score | 0);
        this.score += this.SCORE_TIME;
        this.diamondCountViewGreen.setText(this.no_of_green_diamonds);
        this.diamondCountViewRed.setText(this.no_of_red_diamonds);
    }

    var hits_ground = this.player.getCollisions("ground");
    for (var i = 0; i < hits_ground.length; i++) {
        this.sound.play("alarm",{loop: false}); //play once
        //animate(this.player).clear();
        this.player.setRotation(0);
        //this.player.resetAnimation();
        animate(this.player).now({dr: -1},50).then({dr: 1},50)
        this.energyView.energyUpdate(-1);
    }

    var hits = this.player.getCollisions("diamondballoons");
    for (var i = 0; i < hits.length; i++) {
        var hit = hits[i];
        var diaballoon = hit.view;
        if (diaballoon.diatype === 'reddiab') {
            this.no_of_red_diamonds++;
        }
        else if (diaballoon.diatype === 'greendiab') {
            this.no_of_green_diamonds++;
        }
        diaballoon.setCollisionEnabled(false);
        diaballoon.removeFromSuperview();
        this.sound.play("star");
    }

    var hits_p = this.player.getCollisions("planes");
    for (var i = 0; i < hits_p.length; i++) {
        var hit = hits_p[i];
        var plane = hit.view;
        this.sound.play("alarm",{loop: false}); //play once
        this.energyView.energyUpdate(-1,'planes');
        animate(this.player)
            .now({
                dr: Math.PI * -2
            }, 500).
            then({r:0}, 1);

        //console.log("finishGame");
        //this.finishGame();  //will finish anyway, ground rule
    }

    var hits_b = this.player.getCollisions("balloons");
    for (var i = 0; i < hits_b.length; i++) {
        hits_b[i].view.setCollisionEnabled(false);
        this.sound.play("alarm")	; //play once
        this.energyView.energyUpdate(-1,'balloons');
        animate(this.player)
            .now({
                r: Math.PI * 2
            }, 500).
            then({r:0},1);
    }

    var hits_z = this.player.getCollisions("zeps");
    for (var i = 0; i < hits_z.length; i++) {
        this.sound.play("alarm",{loop: false}); //play once
        this.energyView.energyUpdate(-1,'zeps');
        animate(this.player)
            .now({r: 0.2}, 60)
            .then({r:-0.2},60)
            .then({r: 0}, 1);
    }

    var hits_g = this.player.getCollisions("medballoons");
    for (i=0; i< hits_g.length; i++) {
        var hit = hits_g[i];
        var goldb = hit.view;
        goldb.setCollisionEnabled(false);
        goldb.removeFromSuperview();
        this.energyView.energyUpdate(50);
        this.no_of_gold_ballons++;
        this.sound.play("medbox");
    }

    // If the player fell off the bottom of the screen, game over!
    if (this.player.getY() >= this.parallaxView.groundLayer.style.height) {
        this.energyView.setThumbSize(0);
        this.textView.setText("Game over - press to play again!");
        finishGame(this);
    }

    if (this.energyView.actualValue<0) {
        this.textView.setText("Game over - press to play again!");
        finishGame(this);
    }
    if (this.player.getY() <= this.MAX_HEIGHT) {
        this.player.velocity.y = 500;
    }

}


function finishGame(that) {
    if (!that.isFinished) {
        that.isFinished = true;
        clearInterval(that.tickInterval);
        that.player.acceleration.x = -400; //slow down
        that.textView.show();
        animate(that.parallaxView)
            .now({opacity: 0.7}, 1000)
            .wait(10000000)
            .then({opacity: 1});
        animate(that._scoreView)
            .now({
                dy: 300
            }, 700, animate.easeIn)
            .then({scale: 2}, 400, animate.easeIn)
            .then({scale: 1}, 400, animate.easeOut)
            .then({y: 0},400);
    }
}

