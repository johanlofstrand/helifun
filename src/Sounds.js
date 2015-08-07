import AudioManager;

	exports.loadSound = function () {
		this.sound = new AudioManager({
			path: "resources/audio/",
			files: {
				background: { volume: 0.8, background: true },
				start: { volume: 1, background: true },
				star: { volume: 1, path: 'effects' },
				medbox: {volume: 1, path: 'effects' },
				alarm: {volume: 0.2, path: 'effects' }
			}
		});
		return this.sound;
	};