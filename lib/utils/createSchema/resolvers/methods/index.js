'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createAssociations = exports.createMutations = exports.createMeta = exports.createQueries = exports.getDB = exports.deleteRecord = exports.getMetaData = exports.findById = exports.findAll = exports.createInstance = undefined;

var _models = require('../../models');

var _models2 = _interopRequireDefault(_models);

var _lodash = require('lodash.orderby');

var _lodash2 = _interopRequireDefault(_lodash);

var _strings = require('../../utils/strings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This is an abstraction to creating queries, mutation, and association queries
 * based on each sequelize model.
 * 
 * These functions take care of not only getting info from the database, but also limited
 * memoization, DataLoader inference, and backend data manipulation. Memoization is done through 
 * a class (cf. `../../utils/Memoize`). Memoization simply keeps track of a set of parameters and the corresponding
 * result from running those parameters. For every mutation that would affect the output of the set parameters, such
 * that x`1 != x`2, need to clear (i.e. delete) the key in cache.
 * 
 * SQL DBs for the most part will only call limit and offset after ordering. Therefore, we are using lodash's 
 * .ordby function after. 
 * 
 * We are using dataloaders for nested data. This increases the speed of subsequent queries by 60-80%. 
 */

/* ---------------- CRUD ------------------- */

// Create


// utilities;
const createInstance = exports.createInstance = async (_, body, context, { returnType }, store) => {
    let storeKey = returnType.toString();
    let loaders = Object.keys(context).filter(c => c.toString().toLowerCase().includes(storeKey.toLowerCase()));

    // reset cache;
    loaders.map(l => context[l].clearAll());
    store.clearKey(storeKey);

    let t = getDB(storeKey);

    return await _models2.default[t].create(body);
};

// Read
const findAll = exports.findAll = async ({ limit = 750, offset = 0, sortField = 'id', sortOrder = 'ASC' }, { returnType }) => {
    let t = getDB(returnType.toString());
    return (0, _lodash2.default)((await _models2.default[t].findAll({ limit, offset })), [sortField], [sortOrder.toLowerCase()]);
};

const findById = exports.findById = async ({ id }, { returnType }) => {
    let t = getDB(returnType.toString());
    return await _models2.default[t].findById(id);
};

// Looks for Data in Store first then runs "expensive" query
// if needed
const getMetaData = exports.getMetaData = async (key, store) => {
    if (store.getKey(key)) {
        return store.getKey(key);
    } else {
        let t = getDB(key);
        let len = await _models2.default[t].count({});
        store.setKey(key, len);
        return len;
    }
};

// Delete
const deleteRecord = exports.deleteRecord = async (id, table) => {
    let t = getDB(table);
    let copy = await _models2.default[t].findById(id);
    await _models2.default[t].destroy({ where: { id } });
    return copy;
};

/* ---------------- Helpers ------------------- */
const getDB = exports.getDB = table => {
    table = table.replace(/\[/g, '').replace(/\]/g, '');
    if (Object.keys(_models2.default).includes(table)) {
        var t = table;
    } else if (Object.keys(_models2.default).includes((0, _strings.pluralize)(table))) {
        t = (0, _strings.pluralize)(table);
    } else {
        t = (0, _strings.singularize)(table);
    }
    return t;
};

/* ---------------- Create Resolvers ------------------- */
const createQueries = exports.createQueries = store => {
    let Query = {};

    const models = Object.keys(_models2.default).slice(0, Object.keys(_models2.default).length - 2);
    let getById = models.map(m => (0, _strings.singularize)(m));

    models.map(m => {
        Query[(0, _strings.singularize)(m)] = (args, $, {}, i) => findById($, i);
        Query[(0, _strings.pluralize)(m)] = (args, $, {}, i) => findAll($, i);
        Query[`${(0, _strings.pluralize)(m)}Meta`] = (_, {}, {}, { fieldName }) => (0, _strings.pluralize)(m);
    });

    return Query;
};

const createMeta = exports.createMeta = store => {
    let Meta = {};
    Meta["count"] = x => getMetaData(x, store);
    return Meta;
};

const createMutations = exports.createMutations = store => {
    let Mutation = {};

    const models = Object.keys(_models2.default).slice(0, Object.keys(_models2.default).length - 2);

    models.map(m => {
        let thisModel = (0, _strings.singularize)(m).charAt(0).toUpperCase() + (0, _strings.singularize)(m).slice(1).toLowerCase();
        Mutation[`create${thisModel}`] = (a, body, c, info) => createInstance(_, body, c, info, store);
        Mutation[`delete${thisModel}`] = (a, { id }, c, { returnType }) => deleteRecord(id, returnType.toString());
    });

    return Mutation;
};

const createAssociations = exports.createAssociations = () => {
    let Association = {};

    const models = Object.keys(_models2.default).slice(0, Object.keys(_models2.default).length - 2);

    models.map(m => {
        Association[(0, _strings.singularize)(m)] = {};
        let i = 0;
        while (i < Object.keys(_models2.default[m].associations).length) {

            let association = Object.keys(_models2.default[m].associations)[i];
            let manyRelation = association.includes('-');
            let associationName = manyRelation ? association.split('-')[0] : association;
            let loaderPrefix = manyRelation ? association.split('-')[1] : association;
            let loaderName = `${(0, _strings.singularize)(loaderPrefix).toLowerCase()}Loader`;

            let key;
            if (manyRelation) {
                key = `${loaderPrefix}Id`;
            } else {
                key = 'id';
            }

            Association[(0, _strings.singularize)(m)][(0, _strings.singularize)(associationName)] = (obj, _, info) => {
                if (obj[key]) return info[loaderName].load(obj[key]);
            };

            i++;
        }
    });

    return Association;
};