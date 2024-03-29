'use strict';

var QFS = require('q-io/fs'),
    Q = require('q'),
    PATH = require('path'),
    inherit = require('inherit'),
    _ = require('lodash'),

    BaseReporter = require('./reporters/base-reporter');


module.exports = inherit({

    /**
     * @param  {String} path Path to library
     */
    __constructor: function(path, mockFS) {
        // Use Mock FS if class run from tests
        QFS = mockFS || QFS;

        this._workDirectory = path ;
        this._testsPath = PATH.join(path, 'gemini');
    },

    /**
     * Return all paths to blocks by masks
     *
     * masks:
     *   *.blocks
     *   blocks-*
     *
     * @private
     * @return {String[]} return paths
     */
    _getBlocksPaths: function() {
        var that = this,
            self = this.__self;

        return QFS.list(that._workDirectory)
            .then(function(files) {
                return files
                    .filter(RegExp.prototype.test.bind(self._BLOCKS_DIR_PATTERN))
                    .map(function(dir) {
                        return PATH.join(that._workDirectory, dir);
                    });
            })
            .then(self._throwIfNotFound('Paths to blocks were not found'));
    },

    /**
     * Return unique list of blocks from all levels
     *
     * @arivate
     * @return {String[]}
     */
    _getBlocks: function() {
        var self = this.__self;
        return this._getBlocksPaths()
            .then(function(paths) {
                return Q.all(paths.map(QFS.list.bind(QFS)));
            })
            .then(function(blocks) {
                return _(blocks)
                    .flatten()
                    .uniq()
                    .difference(self._EXCLUDE_BLOCKS)
                    .value();
            })
            .then(self._throwIfNotFound('Blocks were not found'));
    },

    /**
     * Return information about gemini coverage on each block
     *
     * @private
     * @param  {[type]} blocks
     * @return {[type]}
     */
    _getInfo: function(blocks) {
        return Q.all(blocks
            .map(function(block) {
                return QFS
                    .listTree(PATH.join(this._testsPath, 'screens', block))
                    .then(function(screens) {
                        return {
                            block: block,
                            screens: this.__self._calculateStates(screens),
                            path: PATH.resolve(this._testsPath, block + '.gemini.js')
                        };
                    }.bind(this));
            }, this));
    },

    /**
     * Return gemini tests for blocks
     *
     * @private
     * @return {String[]} Names of tests
     */
    _getTests: function() {
        var self = this.__self;
        return QFS.exists(this._testsPath)
            .then(function(exists) {
                return exists ? QFS.list(this._testsPath) : [];
            }.bind(this))
            .then(function(tests) {
                return tests
                    .filter(RegExp.prototype.test.bind(self._TESTS_PATTERN))
                    .map(function(test) {
                        return test.match(self._TESTS_PATTERN)[1];
                    });
            });
    },

    /**
     * Return onformation about gemini coverage
     *
     * @public
     * @return {Object} objects witch information about coverage
     */
    flow: function() {
        var self = this.__self;

        return Q()
            .then(self._checkOnDirExists(this._workDirectory, 'Library directory was not found'))
            .then(this._getTests.bind(this))
            .then(function(tests) {
                return Q.all([
                        this._getInfo(tests),
                        this._getBlocks()
                    ])
                    .spread(function(covered, blocks) {
                        return {
                            covered: covered,
                            notCovered: _.difference(blocks, tests)
                        };
                    });
            }.bind(this));
    },

    /**
     * Print information about gemini tests
     *
     * @public
     * @param  {BaseReporter} reporter Instance of reporter
     * @return {Promise|undefined}
     */
    resolve: function(reporter) {
        if(!(reporter instanceof BaseReporter)) {
            throw new TypeError('Reporter must implement BaseReporter interface');
        }

        return this
            .flow()
            .then(function(coverage) {
                reporter.print(coverage, this._workDirectory);
                return coverage;
            }.bind(this));
    }

}, {

    /**
     * Throw error if directory not exists
     *
     * @private
     * @static
     * @param  {String} path Path po directory
     * @param  {String} errMsg Error message
     * @return {Promise|null}
     */
    _checkOnDirExists: function(path, errMsg) {
        return function() {
            return QFS.isDirectory(path)
                .then(function(isDir) {
                    if(!isDir) {
                        throw new Error(errMsg);
                    }
                    return Q.resolve();
                });
        };
    },

    /**
     * Check array on empty and return rejected
     * promise with error message
     *
     * @private
     * @static
     * @param  {Array[]} arr Source array
     * @return {Array[]|Promise} source array or rejected promise
     */
    _throwIfNotFound: function(errMsg) {
        return function(arr) {
            return arr.length === 0 ? Q.reject(new Error(errMsg)) : arr;
        };
    },

    /**
     * Calculate gemini states by screenshots
     *
     * @private
     * @static
     * @param  {String[]} screens Paths to screenshots
     * @return {Number} count of states
     */
    _calculateStates: function(screens) {
        return _(screens)
            .filter(RegExp.prototype.test.bind(/.+\.png$/))
            .map(function(screenPath) {
                 return screenPath.replace(/[^\/]+$/, '');
            })
            .uniq()
            .size();
    },

    _BLOCKS_DIR_PATTERN: /.+\.blocks$|^blocks-.+/,
    _TESTS_PATTERN: /(.+)\.gemini\.js/,
    _EXCLUDE_BLOCKS: ['.bem']

});
