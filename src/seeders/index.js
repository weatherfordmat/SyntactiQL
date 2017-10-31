import Sequelize from 'sequelize';
import db from '../models';

/**
 * This calls our mocked data; 
 * 
 * I am separating this from the fakerData file because
 * there may be multiple ways to insert mock data in the future based on
 * configuration.
 */

// utilities;
import { error, describe, info, success, warning } from '../utils/log';
import fs from 'fs';

// data;
import { getRandomData } from './fakerData';

const models = Object.keys(db).slice(0, Object.keys(db).length-2);

(function() {
    models.map(m => {
        db[m].bulkCreate(getRandomData(m))
            .then(_ => success(`Successfully added ${m}`))
            .catch(e => error(e));
    });
})();
