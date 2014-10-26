'use strict';

var esprima = require('esprima');
var traverse = require('./traverse');

/**
 * Проверяет, является ли указанный узел БЭМ блоком.
 * Матчится на вызов метода decl.
 *
 * @param  {Object}  node
 * @return {Boolean}
 */
function isBem(node) {
    return node.type === 'CallExpression' &&
        node.callee.property &&
        node.callee.property.type === 'Identifier' &&
        node.callee.property.name === 'decl';
}

/**
 * Парсит эспримой содержимое js файла и возвращает синтаксическое дерево.
 * В противном случае вернет null.
 *
 * @param  {String} string
 * @return {Object}
 */
module.exports = function (string) {
    var tree = esprima.parse(string, {attachComment: true});
    var bemNode = null;

    traverse(tree, function (node) {
        if (!isBem(node)) {
            return false;
        }

        bemNode = node;

        return true;
    });

    return bemNode;
};