import config from './config.json';
import Sequelize from 'sequelize';
const stage = process.env.NODE_ENV || 'development';

/**
 * Creates instance of sequelize instance
 */
export default new Sequelize(config[stage].database, config[stage].username, config[stage].password, {
    host: config[stage].host,
    dialect: config[stage].dialect,
    operatorsAliases: true,
    logging: false,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});