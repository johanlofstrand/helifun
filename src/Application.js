import device;
import ui.StackView as StackView;
import src.TitleScreen as TitleScreen;
import src.GameScreen as GameScreen;
import src.Sounds as Sounds;

exports = Class(GC.Application, function () {

	this.baseHeight = 760;
	this.baseWidth = device.screen.width * (this.baseHeight / device.screen.height);
	this.scale = device.screen.height / this.baseHeight;
	this.initUI = function () {
		var titlescreen = new TitleScreen(),
			gamescreen = new GameScreen({width: this.baseWidth, height: this.baseHeight});

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
			sound.play("start");
		}.bind(this), 10);

		titlescreen.on('titlescreen:start', function () {
			rootView.push(gamescreen);
			sound.stop("start");
			gamescreen.emit('app:start');
		});
	};

	device.setBackButtonHandler(function() {
		return false;
	});

	this.launchUI = function () {};
});