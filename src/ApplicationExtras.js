import device;
import ui.View;
import AudioManager;
import src.platformer.ScoreView as ScoreView;


	// Sound effects are straightforward:
	exports.loadSound = function () {
		this.sound = new AudioManager({
			path: "resources/audio/",
			files: {
				background: { volume: 1, background: true },
				win: { volume: 1, background: true  },
				lose: { volume: 1, path: 'effects' },
				star1: { volume: 0.5, path: 'effects' },
				star2: { volume: 0.5, path: 'effects' },
				star3: { volume: 0.5, path: 'effects' },
				star4: { volume: 0.5, path: 'effects' },
				star5: { volume: 0.5, path: 'effects' },
				star6: { volume: 0.5, path: 'effects' },
				star7: { volume: 0.5, path: 'effects' },
				star8: { volume: 0.5, path: 'effects' },
			}
		});
		return this.sound;
	}

	// The UI for this game is pretty simple: just a score view.
	exports.setupUILayer = function (view) {
		this.scoreView = new ScoreView({
			superview: view,
			zIndex: 10000,
			x: 0,
			y: 10,
			width: view.style.width,
			height: 70,
			anchorX: view.style.width / 2,
			anchorY: 35,
			charWidth: 50,
			charHeight: 70,
			text: "0",
			url: 'resources/images/numbers/char-{}.png',
		});
		return this.scoreView;
	}

	this.onJump = function(evt,point) {
		/*console.log("onJump");
		console.log("View clicked at position:" +point.y);
		this.player.velocity.y = -1 * JUMP_VELOCITY;
		console.log("Player position: " + this.player.position.y);
		/*if (!this.isFinished) {
			if ((this.player.jumpingLevel == 0 && this.player.velocity.y < 150)
					|| this.player.jumpingLevel == 1) {
						this.player.jumpingLevel++;
						this.player.velocity.y = -1 * JUMP_VELOCITY;
						this.player.startAnimation(this.player.jumpingLevel == 1 ? "jump" : "float", {
							loop: this.player.jumpingLevel == 2,
							callback: function () {
								this.player.startAnimation("glider", {loop: true});
							}.bind(this)
						});
					}
		} else {
			this._touchedWhenFinished = true;
		}*/
	}

	this.onJumpDone = function () {
		console.log("onJumpDone");
		/*	this.player.velocity.y =  JUMP_VELOCITY;
		if (this._touchedWhenFinished && this.isFinished) {
			this._touchedWhenFinished = false;
			// If the game was over, start a new game
			this.startGame();
		} else {
			// When the player lifts their finger
			// swap out the animation to show that they're
			// falling faster now
			/*if (this.player.jumpingLevel > 0) {
				this.player.startAnimation("land", {
					loop: true
				});
			}
			console.log("bad state");
		}*/
	}
