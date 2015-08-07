import ui.View;
import ui.ImageView;
import src.platformer.ParallaxView as ParallaxView;
import src.GroundLayer as groundlayer;
import src.ZepLayer as zeplayer;
import src.DiamondLayerGreen as diamondlayergreen;
import src.DiamondLayerRed as diamondlayerred;
import src.DepthLayers as DepthLayers;
import src.PlaneLayer as planelayer;
import src.BalloonLayer as balloonlayer;
import src.MedBalloonLayer as medballoonlayer;

exports = Class(ParallaxView, function (supr) {

    this.init = function (opts) {
        opts = merge(opts, {
            width:	opts.width,
            height: opts.height,
            scale: 1
        });

        this.super = opts;

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function () {

        this.style.backgroundColor = "#87CEFA";

        this.groundLayer = this.addLayer({
            distance: 7,
            populate: function (layer, x) {
                return groundlayer.populateGroundLayer(layer, x);
            }.bind(this)
        });

        this.addLayer({
            distance: 7,
            populate: function (layer, x) {
                return zeplayer.populateZepLayer(layer, x);
            }.bind(this)
        });

        DepthLayers.addWater(this);
        DepthLayers.addCloud(this);

        this.addLayer({
            distance: 7,
            populate: function (layer, x) {
                return diamondlayergreen.populateDiamondLayer(layer, x);
            }.bind(this)

        });

        this.addLayer({
            distance: 7,
            populate: function (layer, x) {
                return diamondlayerred.populateDiamondLayer(layer, x);
            }.bind(this)

        });

        this.addLayer({
            distance: 7,
            populate: function (layer, x) {
                return planelayer.populatePlaneLayer(layer, x);
            }.bind(this)

        });

        this.addLayer({
            distance: 7,
            populate: function (layer, x) {
                return balloonlayer.populateBalloonLayer(layer, x);
            }.bind(this)

        });

        this.addLayer({
            distance: 7,
            populate: function (layer, x) {
                return medballoonlayer.populateMedBalloonLayer(layer, x);
            }.bind(this)

         });
    };
});