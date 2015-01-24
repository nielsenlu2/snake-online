'use strict';

/**
 * @param {number} index
 * @param {xss.level.Level} level
 * @extends {xss.game.Snake}
 * @constructor
 */
xss.game.ServerSnake = function(index, level) {
    xss.game.Snake.call(this, index, level);
    this.index = index;
    this.level = level;
    /** @type {xss.game.SnakeMove} */
    this.limbo = null;
    this.elapsed = 0;
};

/** @lends {xss.game.ClientSnake.prototype} */
xss.util.extend(xss.game.ServerSnake.prototype, xss.game.Snake.prototype);
xss.util.extend(xss.game.ServerSnake.prototype, /** @lends xss.game.ServerSnake.prototype */ {

    destruct: function() {
        this.level = null;
    },

    /**
     * @return {Array}
     */
    serialize: function() {
        return [this.index, this.direction, this.parts];
    },

    /**
     * @param {number} tick
     * @param {number} elapsed
     * @param shift
     * @param {Array.<xss.room.Player>} players
     */
    handleNextMove: function(tick, elapsed, shift, players) {
        this.elapsed += elapsed;

        if (!this.crashed && this.elapsed >= this.speed) {
            var move = new xss.game.SnakeMove(
                this, players, this.level, this.getNextPosition()
            );

            this.elapsed -= this.speed;

            if (!move.collision) {
                this.limbo = null;
                this.move(move.location);
            } else if (!this.limbo) {
                this.limbo = move;
                this.limbo.tick = tick;
            }
        }
    },

    /**
     * @return {xss.Coordinate}
     */
    getNextPosition: function() {
        var shift, head = this.getHead();
        shift = xss.GAME_SHIFT_MAP[this.direction];
        return [head[0] + shift[0], head[1] + shift[1]];
    },

    /**
     * @param {number} tick
     * @return {boolean}
     */
    hasCollisionOnTick: function(tick) {
        return !this.crashed && this.limbo && this.limbo.tick === tick;
    }

});
