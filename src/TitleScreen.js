import ui.View;
import ui.ImageView;

import device;

exports = Class(ui.ImageView, function (supr) {
    this.boundsWidth = 1000;
    this.boundsHeight = 760;
    this.baseWidth = device.screen.width * (this.boundsHeight / device.screen.height); //864
    this.baseHeight = this.boundsHeight; //576
    this.scale = device.screen.height / this.baseHeight; //1

    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: this.baseWidth,
            height: this.baseHeight,
            image: "resources/images/TitleScreen.png"
        });

        supr(this, 'init', [opts]);

        var startbutton = new ui.View({
            superview: this,
            x: 0,
            y: 0,
            width: this.baseWidth,
            height: this.baseHeight,
            scale: this.scale
        });

        startbutton.on('InputSelect', bind(this, function () {
            console.log("start game");
            this.emit('titlescreen:start');
        }));
    };
});