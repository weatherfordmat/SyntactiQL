'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _models = require('../../../../../sequelize/models');

var _models2 = _interopRequireDefault(_models);

var _log = require('../log');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _fakerData = require('./fakerData');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const models = Object.keys(_models2.default).slice(0, Object.keys(_models2.default).length - 2);

// data;


/**
 * This calls our mocked data; 
 * 
 * I am separating this from the fakerData file because
 * there may be multiple ways to insert mock data in the future based on
 * configuration.
 */

// utilities;


const CreateRandomSeedData = () => {
    models.map(m => {
        _models2.default[m].bulkCreate((0, _fakerData.getRandomData)(m)).then(_ => (0, _log.success)(`Successfully added ${m}`)).catch(e => (0, _log.error)(e));
    });
};

exports.default = CreateRandomSeedData;