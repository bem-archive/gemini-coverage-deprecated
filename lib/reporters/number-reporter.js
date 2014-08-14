'use strict';

var inherit = require('inherit'),

    BaseReporter = require('./base-reporter');

module.exports = inherit(BaseReporter, {

    print: function(diff) {
        console.log('%s/%s', diff.covered.length, diff.notCovered.length + diff.covered.length);
    }

});
