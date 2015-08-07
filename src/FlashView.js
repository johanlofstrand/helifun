import ui.View as View;
import ui.ImageView as ImageView;

exports.setupFlashView = function(view) {

    this.nightView = new View({
            superview: view,
            x: 0,
            y: 0,
            width: view.style.width,
            height: view.style.height,
            backgroundColor: '#000010',
            opacity: 0.8
        });

    return this.nightView;
};