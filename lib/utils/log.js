'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.success = exports.warning = exports.describe = exports.info = exports.error = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This is a simple terminal based logging system;
 * I will add support for keeping .log files.
 */

let config = {
    "colors": true,
    "logging": ["error", "describe", "info", "warning", "success"],
    "dbLogs": true,
    "fakerCount": 9500,
    "schemaName": "schema.graphql",
    "sequelize": true
};

const error = exports.error = s => logWrapper('error', _chalk2.default.red.bold, s);

const info = exports.info = s => logWrapper('info', _chalk2.default.blue, s

// can I think of a better word for this?
);const describe = exports.describe = s => logWrapper('describe', _chalk2.default.gray, s);

const warning = exports.warning = s => logWrapper('warning', _chalk2.default.yellow, s);

const success = exports.success = s => logWrapper('success', _chalk2.default.green.bold, s);

const pad = s => {
    return `${s}\n`;
};

const loggingLevel = (colors, included, cb, s) => {
    if (colors) {
        return cb();
    } else if (!included) {
        return null;
    } else {
        console.log(s);
    }
};

const logWrapper = (name, _c, s) => {
    return loggingLevel(config.colors, config.logging.includes(name), () => console.log.call(null, _c(pad(s))), s);
};