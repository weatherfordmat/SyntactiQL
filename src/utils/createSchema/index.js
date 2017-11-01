import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import db from '../../models';

// utilities;
import { error, describe, info, success, warning } from '../../utils/log';
import { pluralize, singularize } from '../strings'

// config
let options = JSON.parse(
    fs.readFileSync(__dirname + '/../../../.tactiqlrc', 'utf-8')
  )["config"];

// config;
import config from '../../config/config.json';
const stage = process.env.NODE_ENV;
const models = Object.keys(db).slice(0, Object.keys(db).length-2);

// data;
import { posts, users } from '../../seeders/fakerData';

/**
 * Imports sequelize instance;
 */
import sequelize from '../../config/sequelize';

/**
 * Test the sequelize connection;
 * Resets and clears table data;
 */
const buildDB = () => {
    sequelize.authenticate()
        .then(_ => success('Connection Successful'))
        .then(_ => {
            models
                .map((m, index) => {
                    db[m].sequelize
                    .query('SET FOREIGN_KEY_CHECKS = 0', {raw: true})
                    .then(_ => {
                        db[m].sync();
                    })
                    .catch(e => error(e));
                    info(`\t Synced model ${models[index]}`);
            });
        })
        .then(_ => {
            describe('Sequelize will gracefully close. . .');
        })
        .catch(_ => error(`Error Connecting to Database ${config[stage].database}`));
}

/**
 * Convert sequelize DataTypes to ${fileName}.graphql types;
 * @params {name: string, type: string}
 */
export const convertSchemaType = (name, type, required=true) => {
    if (name === 'id' && required) {
        let addon = required ? '!' : '';
        return `ID${addon}`;
    }
    switch(type) {
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
}

/**
 * Develop the schema Query type;
 */
const schemaQuery = models.map(m => {
    let name = db[m].name;
    let type = '';
    type += `\t${singularize(name)}(id: ID!): ${singularize(name)}\n`
    type += `\t${pluralize(name)}(limit: Int, offset: Int, sortField: String, sortOrder: String): [${singularize(name)}]\n`;
    type += `\t${pluralize(name)}Meta: Meta\n`;
    return type;
});

/**
 * Build Mutation Type
 */
const schemaMutation = models.map(m => {
    let name = db[m].name;
    let type = '';
    let insideParens = [];
    
    let fields = Object.keys(db[m].attributes);
    insideParens = fields
        .filter(f => f !== 'id')
        .map(f => {
                let fieldType = db[m].rawAttributes[f].type.toSql();
                let t = convertSchemaType(f, fieldType, false)
                return `${f}:${t}`;
        });

    type += `\tcreate${singularize(name)}(${insideParens}): ${singularize(name)}\n`;
    type += `\tdelete${singularize(name)}(id: ID!): ${singularize(name)}\n`
    return type;
});

/**
 * Converts Sequelize to Schema
 */
let schema = models.map((m, index) => {
    let name = db[m].name
    let fields = Object.keys(db[m].attributes);
    let type = `\ntype ${singularize(name)} {`
    let associations = db[m].associations
        fields.map(field => {
            let fieldType = db[m].rawAttributes[field].type.toSql();
            let schemaType = convertSchemaType(field, fieldType);
            type += `\n ${field}: ${schemaType}`;
    });
    Object.keys(associations).map(a => { 
        if (a.includes('-')) {
            let f = a.split('-').map(singularize)
            type += `\n\t${f[0]}: [${f[1]}]`
        } else {
            let t = singularize(a);
            type += `\n\t${t}: [${t}]`
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
(function main() {
    if (process.env.NODE_ENV !== 'test') {
        buildDB();
        let file = path.join(__dirname, `../../schema/${options.schemaName}`);
        fs.writeFile(file, '', () => describe('Cleared Old Contents'));
        let stream = fs.createWriteStream(file, {flags:'a'});
        schema.map((el, i) => {
            stream.write(el);
            if (i + 1 === schema.length) {
                success(`\nBuilt ${file}`);
                stream.end();
            }
        });
    }
})();
