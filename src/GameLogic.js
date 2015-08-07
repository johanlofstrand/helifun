import src.GameScreen as GameScreen;

exports = Class(GameScreen, function(supr) {

    this.init = function (name) {
        //Call the init of the super class with the arguments passed to this class.
        supr(this, 'init', arguments);
    };




    this.resetState = function() {
        var that = this;
        if (that.isFinished) {
            animate(that.scoreView).commit();
            animate(that.parallaxView).commit();
        }
        that.t = 0;
        that.isFinished = false;
        that.score = 0;
        that.no_of_green_diamonds = 0;
        that.no_of_red_diamonds = 0;
        that.energyView.energyUpdate(10000);
        that.no_of_gold_ballons=0;
        //	this.BalloonBoard.removeAllSubviews();
        startGame.call(that);

    };



    this.startGame = function() {
        this.sound.stop("win");
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

        // var i = setInterval(GameLogic.tick.bind(), dt);
        //GameLogic.tick.bind();


    }

    this.tick = function(dtMS) {

        var dt = Math.min(dtMS / 1000, 1 / 30); //return lowest value of these
        this.t += dt;

        if (!this.loaded) {
            return;
        }

        if (this.isFinished) {
            if (this.player.velocity.x < 0) {
                this.player.stopAllMovement();
                this.sound.stop("background");
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
            this.diamondCountViewGreen.setText(this.no_of_green_diamonds);
            this.diamondCountViewRed.setText(this.no_of_red_diamonds);
        }

        var hits_ground = this.player.getCollisions("ground");
        for (var i = 0; i < hits_ground.length; i++) {
            this.sound.play("alarm", {loop: false}); //play once
            //animate(this.player).clear();
            this.player.setRotation(0);
            //this.player.resetAnimation();
            animate(this.player).now({dr: -1}, 50).then({dr: 1}, 50)
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

        // If they hit an ememy plane
        var hits_p = this.player.getCollisions("planes");
        for (var i = 0; i < hits_p.length; i++) {
            var hit = hits_p[i];
            var plane = hit.view;
            this.sound.play("alarm", {loop: false}); //play once
            this.energyView.energyUpdate(-1, 'planes');
            animate(this.player)
                .now({
                    dr: Math.PI * -2
                }, 500).
                then({r: 0}, 1);

            //console.log("finishGame");
            //this.finishGame();  //will finish anyway, ground rule
        }

        // If they hit an balloon
        var hits_b = this.player.getCollisions("balloons");
        for (var i = 0; i < hits_b.length; i++) {
            hits_b[i].view.setCollisionEnabled(false);
            this.sound.play("alarm"); //play once
            this.energyView.energyUpdate(-1, 'balloons');
            animate(this.player)
                .now({
                    r: Math.PI * 2
                }, 500).
                then({r: 0}, 1);
        }

        // If they hit a zep
        var hits_z = this.player.getCollisions("zeps");
        for (var i = 0; i < hits_z.length; i++) {
            this.sound.play("alarm", {loop: false}); //play once
            this.energyView.energyUpdate(-1, 'zeps');
            animate(this.player)
                .now({r: 0.2}, 60)
                .then({r: -0.2}, 60)
                .then({r: 0}, 1);
        }

        // If they hit a gold balloon
        var hits_g = this.player.getCollisions("medballoons");
        for (i = 0; i < hits_g.length; i++) {
            var hit = hits_g[i];
            var goldb = hit.view;
            goldb.setCollisionEnabled(false);
            goldb.removeFromSuperview();
            this.energyView.energyUpdate(100);
            this.no_of_gold_ballons++;
            this.sound.play("medbox");


        }

        // If the player fell off the bottom of the screen, game over!
        if (this.player.getY() >= this.parallaxView.gameLayer.style.height) {
            this.energyView.setThumbSize(0);
            this.textView.setText("Game over - press to play again!");
            this.finishGame();
        }

        if (this.energyView.actualValue < 0) {
            this.textView.setText("Game over - press to play again!");
            this.finishGame();
        }
        if (this.player.getY() <= this.MAX_HEIGHT) {
            this.player.velocity.y = 500;
        }
    };

});
