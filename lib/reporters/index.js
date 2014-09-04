'use strict';

var REPORTERS = {
        std: './std-reporter',
        number: './number-reporter',
        html: './html-reporter',
        summary: './summary-reporter'
    };

///
exports.list = function() {
    return Object.keys(REPORTERS);
};

///
exports.default = function() {
    return 'std';
};

///
exports.mk = function(key) {
    if(!REPORTERS[key]) {
        throw new Error('Reporter "' + key + '" not found');
    }

    var Reporter = require(REPORTERS[key]);
    return new Reporter();
};
