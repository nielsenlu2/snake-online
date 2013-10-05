'use strict';

/**
 * SelectMenu
 * Creates a single navigatable verticle menu
 * @param {(string|Function)=} header
 * @param {string=} footer
 * @constructor
 */
xss.SelectMenu = function(header, footer) {
    this._header = header || '';
    this._footer = footer || '';
    this._selected = 0;
    this._options = [];
};

xss.SelectMenu.prototype = {

    /**
     * @param {?(boolean|string|number)} value
     * @param {function()|null} next
     * @param {string} title
     * @param {string=} description
     * @param {function(number)=} callback
     */
    addOption: function(value, next, title, description, callback) {
        this._options.push({
            value      : value,
            next       : next,
            title      : title,
            description: description || '',
            callback   : callback || xss.util.dummy
        });
    },

    /**
     * @returns {number}
     */
    prev: function() {
        return this.select(this._selected - 1);
    },

    /**
     * @returns {number}
     */
    next: function() {
        return this.select(this._selected + 1);
    },

    /**
     * @param {number} select
     * @returns {number}
     */
    select: function(select) {
        var max = this._options.length - 1;

        if (typeof select !== 'number') {
            select = 0;
        } if (select < 0) {
            select = max;
        } else if (select > max) {
            select = 0;
        }

        this._selected = select;
        this.getSelectedOption().callback(this._selected);
        return select;
    },

    /**
     * @return {Object}
     */
    getSelectedOption: function() {
        return this._options[this._selected];
    },

    /**
     * @return {Function}
     */
    getNextStage: function() {
        return this.getSelectedOption().next;
    },

    /**
     * @return {xss.Shape}
     */
    getShape: function() {
        var x, y, header, headerPixels, shape, desc;

        x = xss.MENU_LEFT;
        y = xss.MENU_TOP;

        // Header
        header = (typeof this._header === 'string') ? this._header : this._header();
        headerPixels = xss.font.pixels(header);
        headerPixels = xss.transform.zoomX2(headerPixels, x, y, true);
        shape = new xss.Shape(headerPixels);
        y += xss.MENU_TITLE_HEIGHT;

        // Footer
        shape.add(xss.font.pixels(
            this._footer, x, xss.HEIGHT - 3 - xss.font.height(this._footer)
        ));

        // Draw options
        for (var i = 0, m = this._options.length; i < m; i++) {
            var title, active = (this._selected === i);
            title = this._options[i].title;
            shape.add(xss.font.pixels(title, x, y, {invert: active}));
            y += xss.Font.LINE_HEIGHT_MENU;
        }

        // Help text line(s)
        if (this._options.length) {
            desc = this.getSelectedOption().description;
            y += xss.Font.LINE_HEIGHT;
            shape.add(xss.font.pixels(desc, x, y, {wrap: xss.MENU_WRAP}));
        }

        return shape;
    }

};
