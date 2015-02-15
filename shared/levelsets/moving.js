'use strict';

/**
 * @extends {xss.levelset.Levelset}
 * @constructor
 */
xss.levelset.Moving = function() {
    xss.levelset.Levelset.apply(this, arguments);
    this.title = xss.COPY_LEVELSET_MOVING;
};

xss.util.extend(xss.levelset.Moving.prototype, xss.levelset.Levelset.prototype);
xss.util.extend(xss.levelset.Moving.prototype, /** @lends {xss.levelset.Moving.prototype} */ {

});
