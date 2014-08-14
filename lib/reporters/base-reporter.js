'use strict';

var inherit = require('inherit');

module.exports = inherit({

    print: function(diff) {
        throw 'Method "print()" must be overridden!';
    }

});
