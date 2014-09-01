'use strict';

var Scanner = require('./scanner'),
    reporters = require('./reporters');

/**
 * Create gemini coverage report
 * @param  {String} path     path to bem project
 * @param  {String} reporter
 * @return {Promise|undefined}
 */
module.exports = function(path, reporter) {
    reporter = reporter || reporters.default();
    return new Scanner(path).resolve(reporters.mk(reporter));
}
