'use strict';

/**
 * @param {EventEmitter} roomEmitter
 * @param {xss.room.ServerPlayerRegistry} players
 * @param {xss.room.Options} options
 * @param {Array.<number>} levelsPlayed
 * @constructor
 * @extends {xss.room.Round}
 */
xss.room.ServerRound = function(roomEmitter, players, options, levelsPlayed) {
    xss.room.Round.call(this, players, options);
    this.roomEmitter = roomEmitter;
    this.levelsetIndex = options.levelset;
    this.levelset = xss.levelsetRegistry.getLevelset(this.levelsetIndex);
    this.levelIndex = this.levelset.getRandomLevelIndex(levelsPlayed);

    /** @type {xss.game.ServerGame} */
    this.game = null;
    /** @type {xss.level.Level} */
    this.level = null;
    this.countdownStarted = false;
    this.bindEvents();
};

xss.extend(xss.room.ServerRound.prototype, xss.room.Round.prototype);

xss.extend(xss.room.ServerRound.prototype, /** @lends {xss.room.ServerRound.prototype} */ {

    destruct: function() {
        if (this.game) {
            this.game.destruct();
            this.game = null;
        }
        if (this.level) {
            this.level.destruct();
            this.level = null;
        }

        this.roomEmitter = null;
        this.levelset = null;

        clearTimeout(this.countdownTimer);
        this.unbindEvents();
    },

    bindEvents: function() {
        this.roomEmitter.on(xss.SE_PLAYER_DISCONNECT, this.handleDisconnect.bind(this));
        this.roomEmitter.on(xss.NC_ROOM_START, this.handleManualRoomStart.bind(this));
    },

    unbindEvents: function() {
        this.roomEmitter.off(xss.SE_PLAYER_DISCONNECT);
        this.roomEmitter.off(xss.NC_ROOM_START);
    },

    /**
     * @param {xss.room.ServerPlayer} player
     */
    emit: function(player) {
        player.emit(xss.NC_ROUND_SERIALIZE, this.serialize());
    },

    /**
     * @param {boolean} enabled
     */
    toggleCountdown: function(enabled) {
        clearTimeout(this.countdownTimer);
        this.countdownStarted = enabled;
        this.players.emit(xss.NC_ROUND_COUNTDOWN, [+enabled]);

        if (enabled) {
            this.countdownTimer = setTimeout(
                this.startRound.bind(this),
                xss.TIME_ROUND_COUNTDOWN * 1000
            );
        }
    },

    startRound: function() {
        this.level = this.getLevel(this.levelsetIndex, this.levelIndex);
        this.game = new xss.game.ServerGame(this.roomEmitter, this.level, this.players);
        this.started = true;
        this.players.emit(xss.NC_ROUND_START);
    },

    handleManualRoomStart: function(nodata, player) {
        if (this.players.isHost(player) && !this.countdownTimer) {
            this.toggleCountdown(true);
        }
    },

    handleDisconnect: function() {
        if (this.countdownStarted) {
            this.toggleCountdown(false);
        }
    }

});
