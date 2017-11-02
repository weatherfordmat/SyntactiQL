'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _models = require('../../../../sequelize/models');

var _models2 = _interopRequireDefault(_models);

var _graphqlTools = require('graphql-tools');

var _log = require('../utils/log');

var _store = require('../store');

var _store2 = _interopRequireDefault(_store);

var _methods = require('./methods');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// config


// graphql
let options = {
    "colors": true,
    "logging": ["error", "describe", "info", "warning", "success"],
    "dbLogs": true,
    "fakerCount": 9500,
    "schemaName": "schema.graphql",
    "sequelize": true

    // import Instance of store;
};

// db wrappers;


/**
 * We create our resolvers by calling our createResolver functions in /methods
 * while also passing an instance of store into our functions;
 * 
 * It's important that we don't duplicate store by re-requiring the Memoize file
 * and calling a new instance of store.
 */

const resolvers = {
    Query: (0, _methods.createQueries)(_store2.default),
    Meta: (0, _methods.createMeta)(_store2.default),
    Mutation: (0, _methods.createMutations)(_store2.default)
};

// add association queries to resolver object;
let associations = (0, _methods.createAssociations)();
Object.keys(associations).map(m => {
    resolvers[m] = associations[m];
});

const ExecutableSchema = types => {
    const typeDefs = _fs2.default.readFileSync(types, 'utf8');
    if (typeDefs.length === 0) {
        (0, _log.error)('Run CreateSchema before running server');
    } else {
        return (0, _graphqlTools.makeExecutableSchema)({
            typeDefs,
            resolvers
        });
    }
};

exports.default = ExecutableSchema;