import device;
import ui.View;
import AudioManager;
import ui.widget.SliderView as SliderView;
import src.platformer.ScoreView as ScoreView;

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

	exports.setupScoreView = function (view) {
		this.scoreView = new ScoreView({
			superview: view,
			zIndex: 10000,
			x: 0,
			y: 10,
			width: view.style.width,
			height: 40,
			anchorX: view.style.width / 2,
			anchorY: view.style.height,
			charWidth: 25,
			charHeight: 35,
			text: "0",
			url: 'resources/images/numbers/char-{}.png',
		});
		return this.scoreView;
	}

	exports.setupSliderView = function(view) {

		this.sliderView = new SliderView({
              superview: view,
              x: 0,
              y: 0,
              width: view.style.width/3,
              height: 25,
         	  offsetX: view.style.width/10,
			  offsetY: 10,
              thumbSize: view.style.width/3,
              active: true,
              track: {
                activeColor: '#FFFFFF' 
              },
              thumb: {
                activeColor: '#FFFF00', //bg color...
                inactiveColor: '#FFFF00',
              }
         });
		return this.sliderView;
	}