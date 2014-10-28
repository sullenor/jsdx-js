describe('transform.js', function () {
    'use strict';

    var expect = require('expect.js');
    var transform = require('../lib/transform');

    var data;

    before(function (done) {
        var fs = require('fs');
        var parseJs = require('../lib/parse-js');
        var path = require('path');
        var filePath = path.resolve(__dirname, './fixture/block.js');

        fs.readFile(filePath, {encoding: 'utf8'}, function (err, content) {
            if (err) {
                throw err;
            }

            data = parseJs(content);
            done();
        });
    });

    describe('parseArguments()', function () {
        it('', function () {});
    });

    describe('parseComments()', function () {
        it('', function () {});
    });

    describe('parseMethods()', function () {
        it('', function () {});
    });

    describe('parseName()', function () {
        it('', function () {});
    });

    describe('transform()', function () {
        var ast;

        before(function () {
            ast = transform.transform(data);
        });

        it('returns an object', function () {
            expect(ast).to.be.an('object');
        });

        it('returns an object with instance[] key', function () {
            expect(ast).to.have.key('instance');
            expect(ast.instance).to.be.an('array');
        });

        it('returns an object with klass[] key', function () {
            expect(ast).to.have.key('klass');
            expect(ast.klass).to.be.an('array');
        });
    });
});