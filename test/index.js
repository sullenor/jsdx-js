describe('index.js', function () {
    'use strict';

    var expect = require('expect.js');
    var index = require('../index');

    it('won\'t throw exception if launched without arguments', function () {
        index();
    });

    it('won\'t throw exception if launched without options', function () {
        index('BEM.DOM.decl(this.name);');
    });
});