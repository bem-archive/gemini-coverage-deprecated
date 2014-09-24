'use strict';

var PATH = require('path'),
    inherit = require('inherit'),
    jade = require('jade'),
    mkdirp = require('mkdirp'),
    ccss = require('clean-css'),
    FS = require('fs'),
    PATH = require('path'),
    css = FS.readFileSync(PATH.resolve(__dirname, 'html-reporter/style.css')),

    BaseReporter = require('./base-reporter');

module.exports = inherit(BaseReporter, {

    print: function(diff, path) {
        var files = [];

        try {
            files = FS.readdirSync(PATH.join(path, 'gemini-coverage'));
        } catch(e) {}

        diff.covered.forEach(function(block) {
            var coverage = __findCoverage(block);
            if(coverage) {
                block.coverage = PATH.join(path, coverage);
            }
        });

        function __findCoverage(block) {
            var coverage = null;
            files.some(function(file) {
                if(file.indexOf(block.block) !== -1 && PATH.extname(file) === '.html') {
                    coverage = file;
                    return true;
                }
            });
            return coverage;
        }

        diff.covered.sort(function(a, b) {
            return a.screens - b.screens;
        });

        var html = jade.renderFile(PATH.resolve(__dirname, 'html-reporter/template.jade'), {
                data: diff,
                css: ccss().minify(css)
            }),
            resultPath = PATH.resolve(process.cwd(), 'gemini-coverage'),
            resultFilePath = PATH.join(resultPath, 'report.html');

        mkdirp.sync(resultPath);
        FS.writeFileSync(resultFilePath, html);

        console.log(resultFilePath);
    }

});
