'use strict';

var parseJs = require('./lib/parse-js');
var transform = require('./lib/transform');

/**
 * Парсит строку, возвращает синтаксическое дерево.
 * В противном случае вернет null.
 *
 * @param  {String} string
 * @param  {Object} options
 * @param  {String} options.context  Имя блока.
 * @param  {Object} options.filename
 * @return {Object}
 */
module.exports = function (string, options) {
    options = options || {};
    return transform(parseJs(string), options);
};
