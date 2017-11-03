'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRandomData = exports.buildData = exports.findMethod = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _models = require('../../../../../sequelize/models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This is a file for mocking data that can be
 * used by both our GraphQL endpoint and our 
 * database. 
 * 
 * This is automated to create the sample data for you. Ultimately,
 * we will need more else/if statements (ideally switch statements)
 * to catch the edge cases;
 */

const models = Object.keys(_models2.default).slice(0, Object.keys(_models2.default).length - 2);

let files = _fs2.default.readdirSync('./', 'utf-8');
let idx = files.indexOf('.tactiqlrc');
let t = files[idx];
let options = JSON.parse(_fs2.default.readFileSync(t, 'utf-8'))["config"];

const flattenFaker = () => {
    let cols = Object.getOwnPropertyNames(_faker2.default);
    return cols.map(c => [c, Object.keys(_faker2.default[c])]);
};

const findMethod = exports.findMethod = str => {
    let cols = flattenFaker();
    let result = cols.map(c => {
        if (c[1].includes(str)) {
            let primary = c[0];
            let n = _faker2.default[primary][str];
            if (n instanceof Function) {
                return n();
            }
        }
    }).filter(f => f !== undefined);
    return result[0] || _faker2.default.random.word();
};

const buildData = exports.buildData = () => {
    let Query = {};
    models.map(m => {
        Query[m] = {};
        let fieldType = _models2.default[m].rawAttributes;
        let fields = Object.keys(fieldType);
        fields.map(f => {
            let type = _models2.default[m].rawAttributes[f].type.toSql();
            if (type === 'TINYINT(1)') {
                Query[m][f] = _faker2.default.random.boolean();
            } else if (f.toLowerCase().includes('id') || f === 'createdAt' || f === 'updatedAt') {
                return;
            } else if (f.toLowerCase().includes('date') || f.toLowerCase().includes('day')) {
                Query[m][f] = _faker2.default.date.past().toString();
            } else {
                Query[m][f] = findMethod(f);
            }
        });
    });
    return Query;
};

let limit = options.fakerCount;
const getRandomData = exports.getRandomData = db => [...Array(limit)].map(a => {
    return buildData()[db];
});