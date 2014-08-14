'use strict';

var inherit = require('inherit'),
    chalk = require('chalk'),
    format = require('util').format,

    BaseReporter = require('./base-reporter');

module.exports = inherit(BaseReporter, {

    print: function(diff) {
        var covered = diff.covered.map(function(block) {
                return format(
                    '%s %s [%s]',
                    chalk.green('+'),
                    block.block,
                    chalk.magenta(block.screens)
                );
            }),
            notCovered = diff.notCovered.map(function(block) {
                return format(
                    '%s %s',
                    chalk.red('-'),
                    block
                );
            });

        return covered.concat(notCovered).join('\n');
    }

});
