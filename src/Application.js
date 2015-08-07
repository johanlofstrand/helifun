import device;
import ui.StackView as StackView;
import src.TitleScreen as TitleScreen;
import src.GameScreen as GameScreen;
import src.Sounds as Sounds;

exports = Class(GC.Application, function () {

	this.baseHeight = 760;
	this.baseWidth = device.screen.width * (this.baseHeight / device.screen.height);
	this.scale = device.screen.height / this.baseHeight;

	//console.log("device.screen.width: " + device.screen.width);
	//console.log("baseWidth: " + this.baseWidth);
	//console.log("baseHeight: " + this.baseHeight);
	//console.log("scale: " + this.scale);

	/* Run after the engine is created and the scene graph is in
	 * place, but before the resources have been loaded.
	 */
	this.initUI = function () {
		var titlescreen = new TitleScreen(),
			gamescreen = new GameScreen();

		this.view.style.backgroundColor = '#87CEFA';

		var rootView = new StackView({
			superview: this,
			x: 0,
			y: 0,
			width: this.baseWidth,
			height: this.baseHeight,
			scale: this.scale
		});

		rootView.push(titlescreen);

		var sound = Sounds.loadSound();
		setTimeout(function () {
			// This is in a setTimeout because some desktop browsers need
			// a moment to prepare the sound (this is probably a bug in DevKit)
			sound.play("start");
		}.bind(this), 10);

		titlescreen.on('titlescreen:start', function () {
			rootView.push(gamescreen);
			sound.stop("start");
			gamescreen.emit('app:start');
            titlescreen.delete;
		});

		/*gamescreen.on('gamescreen:end', function () {
			sound.stop('background');
			rootView.pop(true,true); //no animation in transiation
		});*/
	};

	device.setBackButtonHandler(function() {
		return false;
	});

	this.onPause= function() {
		sound.stop('background');
		sound.stop('start');
	};

	this.onResume = function() {
		sound.start('background');
		sound.start('start');
	};

	/* Executed after the asset resources have been loaded.
	 * If there is a splash screen, it's removed.
	 */
	this.launchUI = function () {};
});