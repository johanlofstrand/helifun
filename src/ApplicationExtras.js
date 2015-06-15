import AudioManager;

	exports.loadSound = function () {
		this.sound = new AudioManager({
			path: "resources/audio/",
			files: {
				background: { volume: 0.6, background: true },
				win: { volume: 0.6, background: true  },
				star: { volume: 0.7, path: 'effects' },
				medbox: {volume: 0.7, path: 'effects' },
				alarm: {volume: 1, path: 'effects' }

			}
		});
		return this.sound;
	}
