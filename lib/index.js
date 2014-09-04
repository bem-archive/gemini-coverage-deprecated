'use strict';

var Scanner = require('./scanner'),
    reporters = require('./reporters');

/**
 * Create gemini coverage report
 * @param  {String} path     path to bem project
 * @param  {String} reporter
 * @return {Promise|undefined}
 */
exports.mkReport = function(path, reporter) {
    reporter = reporter || reporters.default();
    return new Scanner(path).resolve(reporters.mk(reporter));
};

/**
 * Get summary for passed coverage statistics
 * @param {Object} coverage
 * @return {Object} coverage summary
 */
exports.summarizeCoverage = function(coverage) {
    return reporters.mk('summary').get(coverage);
};
