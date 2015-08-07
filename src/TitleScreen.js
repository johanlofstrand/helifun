import ui.ImageView;

exports = Class(ui.ImageView, function (supr) {

    this.init = function (opts) {
        opts = merge(opts, {
            image: "resources/images/bgimg.png"
        });

        supr(this, 'init', [opts]);

        this.on('InputSelect', bind(this, function () {
            this.emit('titlescreen:start');
        }));
    };
});