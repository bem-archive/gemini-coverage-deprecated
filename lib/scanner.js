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
    __constructor: function(path) {
        this._workDirectory = path ;
        this._testsPath = PATH.resolve(path, 'gemini');

        this._BLOCKS_DIR_PATTERN = /.+\.blocks$|^blocks-.+/;
        this._TESTS_PATTERN = /(.+).gemini.js/;
        this._EXCLUDE_BLOCKS = ['.bem'];
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
        return QFS.list(this._workDirectory)
            .then(function(files) {
                return files
                    .reduce(function(files, file) {
                        this._BLOCKS_DIR_PATTERN.test(file) && files.push(PATH.join(this._workDirectory, file));
                        return files;
                    }.bind(this), []);
            }.bind(this))
            .then(this._throwIfNotFound('Paths to blocks were not found'));
    },

    /**
     * Return unique list of blocks from all levels
     *
     * @arivate
     * @return {String[]}
     */
    _getBlocks: function() {
        return this._getBlocksPaths()
            .then(function(paths) {
                return Q.all(paths.map(QFS.list));
            })
            .then(function(blocks) {
                return _(blocks)
                    .flatten()
                    .uniq()
                    .xor(this._EXCLUDE_BLOCKS)
                    .value();
            }.bind(this))
            .then(this._throwIfNotFound('Blocks were not found'));
    },

    /**
     * Check array on empty and return rejected
     * promise with error message
     *
     * @private
     * @param  {String} errMsg Message
     * @param  {Array[]} arr Source array
     * @return {Array[]|Promise} source array or rejected promise
     */
    _throwIfNotFound: function(errMsg, arr) {
        return function(arr) {
            return arr.length === 0 ? Q.reject(new Error(errMsg)) : arr;
        };
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
                            screens: this._calculateStates(screens),
                            path: PATH.join(this._testsPath, block + '.gemini.js')
                        };
                    }.bind(this));
            }, this));
    },

    /**
     * Calculate gemini states by screenshots
     *
     * @private
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

    /**
     * Return gemini tests for blocks
     *
     * @private
     * @return {String[]} Names of tests
     */
    _getTests: function() {
        return QFS.list(this._testsPath)
            .then(function(tests) {
                return tests
                    .filter(RegExp.prototype.test.bind(this._TESTS_PATTERN))
                    .map(function(test) {
                        return test.match(this._TESTS_PATTERN)[1];
                    }, this);
            }.bind(this))
            .then(this._throwIfNotFound('Tests were not found'));
    },

    /**
     * Return onformation about gemini coverage
     *
     * @public
     * @return {Object} objects witch information about coverage
     */
    flow: function() {
        return  Q()
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
            throw new Error('Reporter must implement BaseReporter interface');
        }

        return this
            .flow()
            .then(reporter.print.bind(reporter));
    }

});
