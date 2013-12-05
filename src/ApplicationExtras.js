import device;
import ui.View;
import AudioManager;

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
