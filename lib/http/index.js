'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _log = require('../utils/log');

var _strings = require('../utils/strings');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _resolvers = require('../resolvers');

var _resolvers2 = _interopRequireDefault(_resolvers);

var _dataloader = require('dataloader');

var _dataloader2 = _interopRequireDefault(_dataloader);

var _loaders = require('../loaders');

var _loaders2 = _interopRequireDefault(_loaders);

var _models = require('../../../../sequelize/models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const graphqlHTTP = require('koa-graphql');

// dataloader;


// gql;


const KoaGQL = file => {
    let context = {};
    Object.keys(_loaders2.default).map(l => {
        let loaderName = `${(0, _strings.singularize)(l).toLowerCase()}Loader`.replace(/batch/g, '');
        context[loaderName] = new _dataloader2.default(keys => _loaders2.default[l](keys, _models2.default));
    });

    let schema = (0, _resolvers2.default)(file);
    let gql = graphqlHTTP({
        schema,
        graphiql: process.env.NODE_ENV === 'development',
        context
    });
    return gql;
};

exports.default = KoaGQL;

/**
 * The idea of the server is to be agnostic as possible about what
 * is passed to it. But ultimately, we need a legitimate schema
 * and the list of the loaders to add to context.
 * 
 * Distributed, parallel, and concurrent programming is typically either
 * implemented at the deployment level (through cloud functions or hooks)
 * or directly in a 24/7 running server. We can then group languages by
 * these two philosophies. We have Node and Python on one side
 * and Elixir and Clojure on the other.
 * 
 */