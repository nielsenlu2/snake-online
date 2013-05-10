/*jshint globalstrict:true, es5:true, sub:true*/
/*globals XSS*/
'use strict';

/**
 * StageFlow instantiation, stage switching
 * @param {Function=} stageRef
 * @constructor
 */
function StageFlow(stageRef) {
    stageRef = stageRef || XSS.stages.main;

    XSS.shapes = {};

    this._prevStages.push(stageRef);
    this._bindGlobalKeys();

    this.setupMenuSkeletton();
    this.newStage(stageRef);
}

StageFlow.prototype = {

    /** @type {Array} */
    _prevStages: [],

    /** @type {Object} */
    stageInstances: {},

    destruct: function() {
        if (XSS.socket) {
            XSS.socket.connection.close();
        }
        XSS.off.keydown(this._handleKeysBound);
    },

    /**
     * @param {function()} stage
     * @return {StageInterface}
     */
    getStage: function(stage) {
        var key = XSS.util.getKey(XSS.stages, stage);
        if (!this.stageInstances[key]) {
            this.stageInstances[key] = stage();
        }
        return this.stageInstances[key];
    },

    /**
     * @param {function()} stageRef
     */
    newStage: function(stageRef) {
        this.stage = this.getStage(stageRef);
        this.setStageShapes();
        this.stage.construct();
    },

    /**
     * @param {function()} newStageRef
     * @param {Object=} options
     */
    switchStage: function(newStageRef, options) {
        var newStage = this.getStage(newStageRef);

        options = options || {};

        // Unload old stage
        this.stage.destruct();

        // Remove everything
        delete XSS.shapes.stage;

        // Replace by animation
        this._switchStageAnimate(
            this.stage.getShape(),
            newStage.getShape(),
            options.back,
            function() {
                this._animateCallback(newStageRef, options.back);
            }.bind(this)
        );
    },

    previousStage: function() {
        var prevs = this._prevStages;
        if (prevs.length > 1) {
            var previous = prevs[prevs.length - 2];
            this.switchStage(previous, {back: true});
        }
    },

    setupMenuSkeletton: function() {
        var border = XSS.shapegen.outerBorder();
        for (var k in border) {
            if (border.hasOwnProperty(k)) {
                XSS.shapes[k] = border[k];
            }
        }
        XSS.shapes.header = XSS.shapegen.header();
    },

    setStageShapes: function() {
        XSS.shapes.stage = this.stage.getShape();
    },

    /**
     * @private
     */
    _bindGlobalKeys: function() {
        this._handleKeysBound = this.handleKeys.bind(this);
        XSS.on.keydown(this._handleKeysBound);
    },

    /**
     * @param {Event} e
     * @private
     */
    handleKeys: function(e) {
        var mute, instruct;

        // Firefox disconnects websocket on Esc. Disable that.
        if (e.keyCode === XSS.KEY_ESCAPE) {
            e.preventDefault();
        }

        // Global mute key.
        // Ignore key when user is in input field. Start screen might
        // contain a dialog, so do not use XSS.keysBlocked here.
        if (!XSS.shapes.caret && e.keyCode === XSS.KEY_MUTE) {
            mute = !XSS.util.storage(XSS.STORAGE_MUTE);
            instruct = 'Sounds ' + (mute ? 'muted' : 'unmuted');
            XSS.util.storage(XSS.STORAGE_MUTE, mute);
            XSS.util.instruct(instruct, 1e3);
            XSS.play.menu_alt();
        }
    },

    /**
     * @param {Shape} oldStage
     * @param {Shape} newStage
     * @param {boolean} back
     * @param {function()} callback
     * @private
     */
    _switchStageAnimate: function(oldStage, newStage, back, callback) {
        var oldStageAnim, newStageAnim, width = XSS.WIDTH;

        if (back) {
            oldStageAnim = {to: [width, 0]};
            newStageAnim = {from: [-width, 0]};
        } else {
            oldStageAnim = {to: [-width, 0]};
            newStageAnim = {from: [width, 0]};
        }

        newStageAnim.callback = callback;

        if (back) {
            XSS.play.swoosh_rev();
        } else {
            XSS.play.swoosh();
        }

        XSS.shapes.oldstage = oldStage.clone().animate(oldStageAnim);
        XSS.shapes.newstage = newStage.clone().animate(newStageAnim);
    },

    /**
     * @param {function()} newStageRef
     * @param {boolean} back
     * @private
     */
    _animateCallback: function(newStageRef, back) {
        // Remove old stages
        delete XSS.shapes.oldstage;
        delete XSS.shapes.newstage;

        // Load new stage
        this.newStage(newStageRef);

        // Log states
        if (back) {
            XSS.util.hash();
            this._prevStages.pop();
        } else {
            this._prevStages.push(newStageRef);
        }
    }

};
