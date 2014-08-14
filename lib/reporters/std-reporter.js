'use strict';

var inherit = require('inherit'),
    chalk = require('chalk'),

    BaseReporter = require('./base-reporter');

module.exports = inherit(BaseReporter, {

    print: function(diff) {
        diff.covered.forEach(function(block) {
            console.log('%s %s [%s]', chalk.green('+'), block.block, chalk.magenta(block.screens));
        });
        diff.notCovered.forEach(function(block) {
            console.log('%s %s', chalk.red('-'), block);
        });
    }

});
