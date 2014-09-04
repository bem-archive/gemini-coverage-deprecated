'use strict';

var inherit = require('inherit');

module.exports = inherit({

    print: function(diff) {
        throw 'Method "print()" not implemented!';
    },

    get: function(diff) {
        throw 'Method "get()" not implemented!';
    }

});
