'use strict';

var parseTags = require('./parse-tags');

/**
 * Список методов, которые не нужно включать в результат.
 *
 * @type {Object}
 */
var ignoredMethods = {
    instance: {
        destruct: true,
        onElemSetMod: true,
        onSetMod: true
    },
    klass: {
        live: true
    }
};

/**
 * Возвращает имя блока.
 *
 * @param  {Object} tree
 * @param  {Object} options
 * @param  {String} options.context
 * @return {Object}
 */
exports.parseName = function (tree, options) {
    switch (tree.type) {
    case 'Literal':
        return {name: tree.value};

    case 'ObjectExpression':
        return tree.properties.reduce(function (block, prop) {
            if (prop.type !== 'Property') {
                return block;
            }

            block[prop.key.name] = prop.key.name === 'block' && isThis(prop.value) ?
                options.context :
                prop.value.value;

            return block;
        }, {});
    case 'MemberExpression':
        return {name: options.context};
    }
};

/**
 * Проверка, является ли узел выражением, использующим this.
 *
 * @param  {object}  node
 * @return {boolean}
 */
function isThis(node) {
    return node.type === 'MemberExpression' && node.object.type === 'ThisExpression';
}

/**
 * Ищет список методов и преобразует его к простому массиву.
 *
 * @param  {Object} tree
 * @param  {Object} ignored
 * @param  {Object} options
 * @return {Array}
 */
exports.parseMethods = function (tree, ignored, options) {
    if (!tree) {
        return null;
    }

    return tree.reduce(function (rs, raw) {
        // Пропускаем заигноренные.
        if (ignored[raw.key.name]) {
            return rs;
        }

        var method = {
            name: raw.key.name,
            arguments: exports.parseArguments(raw.value.params),
            description: exports.parseComments(raw.leadingComments, options)
        };

        rs.push(method);

        return rs;
    }, []);
};

/**
 * Возвращает список аргументов метода.
 *
 * @param  {Array} params
 * @return {Array}
 */
exports.parseArguments = function (params) {
    return Array.isArray(params) && params.length ?
        params.map(function (a) {
            return a.name;
        }) :
        [];
};

/**
 * Ищет блочный комментарий, парсит его и возвращает результат.
 *
 * @param  {Array}  comments
 * @param  {Object} options
 * @return {Object}
 */
exports.parseComments = function (comments, options) {
    if (!Array.isArray(comments)) {
        return null;
    }

    var ln = comments.length;
    var comment;

    for (; ln--;) {
        comment = comments[ln];

        // Пропускаем неблочные комментарии.
        if (comment.type !== 'Block' || comment.value.charAt(0) !== '*') {
            continue;
        }

        return parseTags(comment, options);
    }

    return null;
};

/**
 * Преобразует полученное эспримой синтаксическое дерево к более простому виду.
 *
 * @param  {Object} tree
 * @param  {Object} options
 * @param  {Object} options.context
 * @param  {Object} options.filename
 * @return {Object}
 */
exports.tranform = function (tree, options) {
    if (!tree) {
        return tree;
    }

    var args = tree.arguments;

    if (!Array.isArray(args)) {
        throw new Error('Unknown structure'); // Add filename
    }

    tree = exports.parseName(args[0], options) || {};
    tree.instance = exports.parseMethods(args[1], ignoredMethods.instance, options) || [];
    tree.klass = exports.parseMethods(args[2], ignoredMethods.klass, options) || [];

    return tree;
};
