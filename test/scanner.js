'uset strict';

var Scanner = require('../lib/scanner');

describe('Scanner', function() {

        it('should reject with error if path is bad', function() {
            return new Scanner('BAD_PATH')
                .flow()
                .should.be.rejectedWith(Error)
        });

        it('should return ceverage information by path', function() {
            return new Scanner(__dirname + '/fixtures/bem-lib')
                .flow()
                .should.eventually.deep.equal(
                    {
                        covered: [
                            {
                                block: 'button',
                                screens: 1,
                                path: '/Users/unl0k/projects/cover/test/fixtures/bem-lib/gemini/button.gemini.js'
                            },
                            {
                                block: 'popup',
                                screens: 2,
                                path: '/Users/unl0k/projects/cover/test/fixtures/bem-lib/gemini/popup.gemini.js'
                            }
                        ],
                        notCovered: [ 'menu' ]
                    }
                );
        });

});
