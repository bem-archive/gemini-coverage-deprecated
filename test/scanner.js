'uset strict';

var Scanner = require('../lib/scanner'),
    mockFS = require('q-io/fs-mock');

describe('Scanner', function() {

    describe('Errors', function() {

        it('should reject with error if path is bad', function() {
            return new Scanner('BAD_PATH')
                .flow()
                .should.be.rejectedWith(Error, 'Library directory were not found');
        });

        it('must rejected if gemini folder not found', function() {
            var mock = mockFS({});

            return new Scanner('/', mock)
                .flow()
                .should.be.rejectedWith(Error, 'Gemini directory were not found');
        });

        it('must rejected if gemini tests not found', function() {
            var mock = mockFS({
                'gemini': {}
            });

            return new Scanner('/', mock)
                .flow()
                .should.be.rejectedWith(Error, 'Tests were not found');
        });

        it('must rejected if paths to blocks not found', function() {
            var mock = mockFS({
                'gemini': {
                    'popup.gemini.js': '',
                    'button.gemini.js': ''
                }
            });

            return new Scanner('/', mock)
                .flow()
                .should.be.rejectedWith(Error, 'Paths to blocks were not found');
        });

        it('must rejected if blocks not found', function() {
            var mock = mockFS({
                'gemini': {
                    'popup.gemini.js': '',
                    'button.gemini.js': ''
                },
                'common.blocks': {},
                'blocks-desktop': {}
            });

            return new Scanner('/', mock)
                .flow()
                .should.be.rejectedWith(Error, 'Blocks were not found');
        });

    });

    describe('Result', function() {

        it('must return result if screens equal 0', function() {
            var mock = mockFS({
                'gemini': {
                    'popup.gemini.js': '',
                    'button.gemini.js': ''
                },
                'common.blocks': {
                    'button': {},
                    'popup': {}
                },
                'blocks-desktop': {
                    'popup': {}
                }
            });

            return new Scanner('/', mock)
                .flow()
                .should.eventually.deep.equal({
                    covered: [
                        {
                            block: 'button', screens: 0, path: '/gemini/button.gemini.js'
                        },
                        {
                            block: 'popup', screens: 0, path: '/gemini/popup.gemini.js'
                        }
                    ],
                    notCovered: []
                });
        });

        it('must correct calculate screens in nested directory', function() {
            var mock = mockFS({
                'gemini': {
                    'popup.gemini.js': '',
                    'button.gemini.js': '',
                    'screens': {
                        'button': {
                            'plain': {
                                'opera.png': '',
                                'chrome.png': ''
                            },
                            'focus': {
                                'opera.png': '',
                                'chrome.png': ''
                            }
                        },
                        'popup': {
                            'plain': {
                                'deep': {
                                    'opera.png': '',
                                    'chrome.png': ''
                                },
                                'other': {
                                    'opera.png': '',
                                    'chrome.png': '',
                                    'firefox.png': ''
                                }
                            },
                            'focus': {
                                'opera.png': '',
                                'chrome.png': ''
                            }
                        }
                    }
                },
                'common.blocks': {
                    'button': {},
                    'popup': {}
                },
                'blocks-desktop': {
                    'popup': {}
                }
            });

            return new Scanner('/', mock)
                .flow()
                .should.eventually.deep.equal({
                    covered: [
                        {
                            block: 'button', screens: 2, path: '/gemini/button.gemini.js'
                        },
                        {
                            block: 'popup', screens: 3, path: '/gemini/popup.gemini.js'
                        }
                    ],
                    notCovered: []
                });
        });

    });

});
