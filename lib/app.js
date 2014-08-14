'use strict';

var PATH = require('path'),
    Scanner = require('./scanner'),

    REPORTERS = {
        std: './reporters/std-reporter',
        number: './reporters/number-reporter',
        html: './reporters/html-reporter'
    };

module.exports = require('coa').Cmd()
    .name(PATH.basename(process.argv[1]))
    .title('gemini coverage')
    .helpful()
    .opt()
        .name('version').title('Show version')
        .short('v').long('version')
        .flag()
        .only()
        .act(function() {
            var p = require('../package.json');
            return p.name + ' ' + p.version;
        })
        .end()
    .opt()
        .name('reporter').title('Choose the reporter: (' + Object.keys(REPORTERS).join(', ') +')')
        .short('r').long('reporter')
        .val(function(val) {
            if(!REPORTERS[val]) {
                throw new Error('Reporter "' + val + '" not found');
            }
            return val;
        })
        .def('std')
        .end()
    .arg()
        .name('path').title('path to libraries')
        .val(function(val) {
            var path = require('fs').statSync(val).isDirectory();
            if(!path) {
                throw new Error('Was specified not directory');
            }
            return val;
        })
        .req()
        .end()
    .completable()
    .act(function(opts, args) {
        var Reporter = require(REPORTERS[opts.reporter]);
        return new Scanner(args.path).resolve(new Reporter());
    })
    .run();
