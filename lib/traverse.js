'use strict';

/**
 * Список итерируемых полей
 *
 * @type {Array}
 */
var props = [
    'arguments',
    'body',
    'callee',
    'expression',
    'object',
    'properties'
];

/**
 * Проверяет, являются ли указанные данные объектом и отсеиваем null.
 *
 * @param  {*}       node
 * @return {Boolean}
 */
function isObject(node) {
    return node && typeof node === 'object';
}

/**
 * Обходит синтаксическое дерево, полученное эспримой,
 * и для каждого узла вызывает функцию fn.
 *
 * Если функция вернет true, то дальнейший обход дерева прекращается.
 *
 * @param  {Object}   ast
 * @param  {Function} fn
 * @param  {Boolean}  result
 * @return {Boolean}
 */
function traverse(ast, fn, result) {
    if (result = fn(ast, result) === true) {
        return true;
    }

    return props.some(function (prop) {
        var child = ast[prop];

        if (isObject(child)) {
            if (Array.isArray(child)) {
                return child.some(function (childElem) {
                    return isObject(childElem) && traverse(childElem, fn, result);
                });
            } else {
                return traverse(child, fn, result);
            }
        }
    });
}

module.exports = traverse;