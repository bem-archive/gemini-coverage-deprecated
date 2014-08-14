'use strict';

var PATH = require('path'),
    inherit = require('inherit'),
    jade = require('jade'),
    mkdirp = require('mkdirp'),
    ccss = require('clean-css'),
    css = require('fs').readFileSync(PATH.resolve(__dirname, 'html-reporter/style.css')),

    BaseReporter = require('./base-reporter');

module.exports = inherit(BaseReporter, {

    print: function(diff) {
        diff.covered.sort(function(a, b) {
            return b.screens - a.screens;
        });

        var html = jade.renderFile(PATH.resolve(__dirname, 'html-reporter/template.jade'), {
                data:diff,
                css: ccss().minify(css)
            }),
            resultPath = PATH.resolve(process.cwd(), 'gemini-coverage'),
            resultFilePath = PATH.join(resultPath, 'report.html');

        mkdirp.sync(resultPath);
        require('fs').writeFileSync(resultFilePath, html);

        return resultFilePath;
    }

});
