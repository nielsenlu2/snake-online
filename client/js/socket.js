/*jshint globalstrict:true, sub:true*/
/*globals XSS, Client, io*/

'use strict';

/**
 * Client-Server communication
 * @constructor
 */
function Socket() {
    this.host = 'http://localhost';
}

Socket.prototype = {

    init: function(callback) {
        /** @namespace io */
        XSS.utils.loadScript('http://localhost/socket.io/socket.io.js', function() {
            this.socket = this.connect(this.host);
            this._addEventListeners(callback);
        }.bind(this));
    },

    /**
     * @param {string} host
     * @return {{on: function(string, function(Object)) }}
     */
    connect: function(host) {
        return io.connect(host);
    },

    _addEventListeners: function(callback) {
        this.socket.on('/xss/connect', function(data) {
            XSS.me = new Client(data['id']);
            if (callback) {
                callback(this);
            }
            this.socket.emit('foo', 'BAR');
        }.bind(this));
    },

    emit: function(action, data) {
        this.socket.emit(action, data);
    }

};