'use strict';

var inherit = require('inherit'),
    BaseReporter = require('./base-reporter');

module.exports = inherit(BaseReporter, {

    print: function(diff) {
        console.log(this.get(diff));
    },

    get: function(diff) {
        return {
            covered: diff.covered.length,
            total: diff.notCovered.length + diff.covered.length
        };
    }

});
