'use strict';

/**
 * @param {xss.levelset.Config} config
 * @constructor
 */
xss.level.Level = function(config) {
    this.config = config;
    this.animations = new xss.levelanim.Registry();
    this.gravity = new xss.level.Gravity(this.config.gravity);

    /** @type {xss.level.Data} */
    this.data = config.level.cache || null;
};

xss.level.Level.prototype = {

    registerAnimations: function() {
        xss.util.noop();
    },

    destruct: function() {
        xss.shapes.level = null;
        xss.shapes.innerborder = null;
        xss.shapegen.outerBorder(function(k) {
            xss.shapes[k] = null;
        });
    },

    /**
     * @param {Function} continueFn
     */
    preload: function(continueFn) {
        var level = this.config.level;
        if (level.cache) {
            continueFn();
        } else {
            new xss.level.ImageDecoder(level.imagedata).then(function(data) {
                level.cache = new xss.level.Data(data, this.animations);
                level.imagedata = null;
                this.data = level.cache;
                this.registerAnimations();
                continueFn();
            }.bind(this));
        }
    },

    /**
     * Client-Only!
     * @returns {xss.Shape}
     */
    paint: function() {
        xss.shapes.level = new xss.Shape(this.data.walls);
        xss.shapes.level.setGameTransform();
        xss.shapes.innerborder = xss.shapegen.innerBorder();

        xss.shapegen.outerBorder(function(k, border) {
            xss.shapes[k] = border;
        });
    }
};
