'use strict';

var inherit = require('inherit'),
    format = require('util').format,

    SummaryReporter = require('./summary-reporter');

module.exports = inherit(SummaryReporter, {

    get: function(diff) {
        var summary = this.__base(diff);
        return format('%s/%s', summary.covered, summary.total);
    }

});
