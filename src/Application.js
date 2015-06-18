
import device;
import ui.StackView as StackView;
import src.TitleScreen as TitleScreen;
import src.GameScreen as GameScreen;
import src.ApplicationExtras as applicationextras;

exports = Class(GC.Application, function () {

	this.boundsWidth = 1000;
	this.boundsHeight = 760;
	this.baseWidth = device.screen.width * (this.boundsHeight / device.screen.height); //864
	this.baseHeight = this.boundsHeight; //576
	this.scale = device.screen.height / this.baseHeight; //1

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
			//layout:'linear',
			x: 0,
			y: 0,
			width: this.baseWidth,
			height: this.baseHeight,
			scale: this.scale
		});

		rootView.push(titlescreen);

		var sound = applicationextras.loadSound();
		setTimeout(function () {
			// This is in a setTimeout because some desktop browsers need
			// a moment to prepare the sound (this is probably a bug in DevKit)
			sound.play("start");
		}.bind(this), 10);

		/* Listen for an event dispatched by the title screen when
		 * the start button has been pressed. Hide the title screen,
		 * show the game screen, then dispatch a custom event to the
		 * game screen to start the game.
		 */
		titlescreen.on('titlescreen:start', function () {
			console.log("Application - titlescreen:start");
			rootView.push(gamescreen);
			sound.stop("start");
			gamescreen.emit('app:start');
		});

		/* When the game screen has signalled that the game is over,
		 * show the title screen so that the user may play the game again.
		 */
		gamescreen.on('gamescreen:end', function () {
			sound.stop('background');
			rootView.pop(true,true); //no animation in transiation
		});
	};

	/* Executed after the asset resources have been loaded.
	 * If there is a splash screen, it's removed.
	 */
	this.launchUI = function () {};
});