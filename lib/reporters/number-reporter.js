'use strict';

var inherit = require('inherit'),
    format = require('util').format,

    BaseReporter = require('./base-reporter');

module.exports = inherit(BaseReporter, {

    print: function(diff) {
        return format(
            '%s/%s',
            diff.covered.length,
            diff.notCovered.length + diff.covered.length
        );
    }

});
