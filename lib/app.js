'use strict';

var PATH = require('path'),
    coverage = require('./'),
    reporters = require('./reporters');

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
        .name('reporter').title('Choose the reporter: (' + reporters.list().join(', ') +')')
        .short('r').long('reporter')
        .def(reporters.default())
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
        return coverage.mkReport(args.path, opts.reporter)
            .thenResolve('Done.');
    });
