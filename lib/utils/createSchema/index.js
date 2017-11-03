'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CreateSchema = exports.convertSchemaType = undefined;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _models = require('../../../../../sequelize/models');

var _models2 = _interopRequireDefault(_models);

var _log = require('../../utils/log');

var _strings = require('../strings');

var _config = require('../../../../../sequelize/config/config.json');

var _config2 = _interopRequireDefault(_config);

var _sequelize3 = require('../../../../../sequelize/config/sequelize');

var _sequelize4 = _interopRequireDefault(_sequelize3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const stage = process.env.NODE_ENV;

// config;


// utilities;

const models = Object.keys(_models2.default).slice(0, Object.keys(_models2.default).length - 2);

/**
 * Imports sequelize instance;
 */


/**
 * Test the sequelize connection;
 * Resets and clears table data;
 */
const buildDB = async () => {
    await _sequelize4.default.authenticate().then(_ => (0, _log.success)('Connection Successful')).then(_ => {
        models.map((m, index) => {
            _models2.default[m].sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true }).then(_ => {
                _models2.default[m].sync({ force: true });
            }).catch(e => (0, _log.error)(e));
            (0, _log.info)(`\t Synced model ${models[index]}`);
        });
    }).then(_ => {
        (0, _log.describe)('Sequelize will gracefully close. . .');
    }).catch(_ => (0, _log.error)(`Error Connecting to Database ${_config2.default[stage].database}`));
};

/**
 * Convert sequelize DataTypes to ${fileName}.graphql types;
 * @params {name: string, type: string}
 */
const convertSchemaType = exports.convertSchemaType = (name, type, required = true) => {
    if (name === 'id' && required) {
        let addon = required ? '!' : '';
        return `ID${addon}`;
    }
    switch (type) {
        case 'INTEGER':
            return 'Int';
        case 'VARCHAR(255)':
            return 'String';
        case 'TINYINT(1)':
            return 'Boolean';
        case 'FLOAT':
            return 'Float';
        default:
            return 'String';
    }
};

/**
 * Develop the schema Query type;
 */
const schemaQuery = models.map(m => {
    let name = _models2.default[m].name;
    let type = '';
    type += `\t${(0, _strings.singularize)(name)}(id: ID!): ${(0, _strings.singularize)(name)}\n`;
    type += `\t${(0, _strings.pluralize)(name)}(limit: Int, offset: Int, sortField: String, sortOrder: String): [${(0, _strings.singularize)(name)}]\n`;
    type += `\t${(0, _strings.pluralize)(name)}Meta: Meta\n`;
    return type;
});

/**
 * Build Mutation Type
 */
const schemaMutation = models.map(m => {
    let name = _models2.default[m].name;
    let type = '';
    let insideParens = [];

    let fields = Object.keys(_models2.default[m].attributes);
    insideParens = fields.filter(f => f !== 'id').map(f => {
        let fieldType = _models2.default[m].rawAttributes[f].type.toSql();
        let t = convertSchemaType(f, fieldType, false);
        return `${f}:${t}`;
    });

    type += `\tcreate${(0, _strings.singularize)(name)}(${insideParens}): ${(0, _strings.singularize)(name)}\n`;
    type += `\tdelete${(0, _strings.singularize)(name)}(id: ID!): ${(0, _strings.singularize)(name)}\n`;
    return type;
});

/**
 * Converts Sequelize to Schema
 */
let schema = models.map((m, index) => {
    let name = _models2.default[m].name;
    let fields = Object.keys(_models2.default[m].attributes);
    let type = `\ntype ${(0, _strings.singularize)(name)} {`;
    let associations = _models2.default[m].associations;
    fields.map(field => {
        let fieldType = _models2.default[m].rawAttributes[field].type.toSql();
        let schemaType = convertSchemaType(field, fieldType);
        type += `\n ${field}: ${schemaType}`;
    });
    Object.keys(associations).map(a => {
        if (a.includes('-')) {
            let f = a.split('-').map(_strings.singularize);
            type += `\n\t${f[0]}: [${f[1]}]`;
        } else {
            let t = (0, _strings.singularize)(a);
            type += `\n\t${t}: [${t}]`;
        }
    });
    type += '\n}\n';
    if (index + 1 === models.length) {
        let query = schemaQuery;
        let mutation = schemaMutation;
        let queryBody = '';
        let mutationBody = '';
        query.map(q => {
            queryBody += q;
        });
        type += `\ntype Meta {\n count: Int \n}\n`;
        type += `\ntype Query {\n ${queryBody} \n}\n`;
        mutation.map(mu => {
            mutationBody += mu;
        });
        type += `\ntype Mutation {\n ${mutationBody} \n}\n`;
    }
    return type;
});

// the file name should be configurable;
const CreateSchema = exports.CreateSchema = async writeTo => {
    await _fs2.default.writeFile(writeTo, '', () => (0, _log.describe)('Cleared Old Contents'));
    await buildDB();
    let stream = _fs2.default.createWriteStream(writeTo, { flags: 'a' });
    schema.map((el, i) => {
        stream.write(el);
        if (i + 1 === schema.length) {
            (0, _log.success)(`\nBuilt ${writeTo}`);
            stream.end();
        }
    });
};