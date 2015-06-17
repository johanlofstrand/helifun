import animate;
import ui.View;
import ui.ImageView;
import src.platformer.ParallaxView as ParallaxView;
import ui.TextView;
import src.GameLayer as gamelayer;
import src.ZepLayer as zeplayer;
import src.DiamondLayer as diamondlayer;
import src.DepthLayers as DepthLayers;
import src.EnemyLayer as enemylayer;
import src.BalloonLayer as balloonlayer;
import src.GoldLayer as goldlayer;



exports = Class(ParallaxView, function (supr) {

    this.init = function (opts) {
        opts = merge(opts, {
            width:	opts.baseWidth,
            height: opts.baseHeight,
            scale: 1 //important - we want title screen to scale but not this view.
        });

        this.super = opts;

        supr(this, 'init', [opts]);

        this.build();
    };

    /*
     * Layout
     */
    this.build = function () {

        this.style.backgroundColor = "#87CEFA";

        this.zepLayer = this.addLayer({
            distance: 7,
            populate: function (layer, x) {
                return zeplayer.populateZepLayer(layer, x);
            }.bind(this)

        });


        this.gameLayer = this.addLayer({
            distance: 7,
            populate: function (layer, x) {
                return gamelayer.populateGameLayer(layer, x);
            }.bind(this)

        });



        DepthLayers.addWater(this);
        DepthLayers.addCloud(this);


        this.diamondLayer = this.addLayer({
            distance: 7,
            populate: function (layer, x) {
                return diamondlayer.populateDiamondLayer(layer, x);
            }.bind(this)

        });

        this.enemyLayer = this.addLayer({
            distance: 7,
            populate: function (layer, x) {
                return enemylayer.populateEnemyLayer(layer, x);
            }.bind(this)

        });

        this.balloonLayer = this.addLayer({
            distance: 7,
            populate: function (layer, x) {
                return balloonlayer.populateBalloonLayer(layer, x);
            }.bind(this)

        });

        this.goldLayer = this.addLayer({
            distance: 7,
            populate: function (layer, x) {
                return goldlayer.populateGoldLayer(layer, x);
            }.bind(this)

         });


    };
});