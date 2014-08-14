'use strict';

var PATH = require('path'),
    inherit = require('inherit'),
    jade = require('jade'),
    mkdirp = require('mkdirp'),

    BaseReporter = require('./base-reporter');

module.exports = inherit(BaseReporter, {

    print: function(diff) {
        diff.covered.sort(function(a, b) {
            return b.screens - a.screens;
        });

        var html = jade.renderFile(PATH.resolve(__dirname, 'html-reporter/template.jade'), {
                data:diff,
                pretty: true
            }),
            resultPath = PATH.resolve(__dirname, '../../reporters/'),
            resultFilePath = PATH.join(resultPath, 'reporter.html');

        mkdirp.sync(resultPath);
        require('fs').writeFileSync(resultFilePath, html);
        console.log(resultFilePath);
    }

});
