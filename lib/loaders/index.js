'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _models = require('../../../../sequelize/models');

var _models2 = _interopRequireDefault(_models);

var _strings = require('../utils/strings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This is the file for all of our dataloaders. Dataloaders (https://www.npmjs.com/package/dataloader)
 * allow us to batch and cache our queries efficiently. 
 * 
 * E.g.
 * In our resolvers, we could call:
 *  Post: {
 *      Author: (UserId, _, { userLoader }) => userLoader(userId);
 * }
 * 
 * This is abstracted in our `../resolvers/methods` file;
 * 
 * N.B. This is most helpful for nested data and not for the direct queries themselves.
 */

const models = Object.keys(_models2.default).slice(0, Object.keys(_models2.default).length - 2);

// Copy of .groupBy function in lodash;
const groupBy = (xs, key) => {
    return xs.reduce((y, x) => {
        (y[x[key]] = y[x[key]] || []).push(x);
        return y;
    }, {});
};

let Loaders = {};

// what if there are multiple foreign keys?
models.map(m => {
    let functionName = `batch${(0, _strings.pluralize)(_models2.default[m].name)}`;
    Loaders[functionName] = async (keys, db) => {
        let association = Object.keys(db[m].associations)[0];
        if (association.includes('-')) {
            let idField = Object.keys(db[m].rawAttributes).filter(f => f.includes('Id'))[0];
            var field = idField;
        } else {
            field = 'id';
        }
        const data = await db[m].findAll({
            raw: true,
            where: {
                [field]: {
                    $in: keys
                }
            }
        });
        const dataGroup = groupBy(data, field);
        return keys.map(k => dataGroup[k] || []);
    };
});

exports.default = Loaders;