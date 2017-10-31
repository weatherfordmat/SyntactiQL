import faker from 'faker';
import fs from 'fs';
import db from '../models';

/**
 * This is a file for mocking data that can be
 * used by both our GraphQL endpoint and our 
 * database. 
 * 
 * This is automated to create the sample data for you. Ultimately,
 * we will need more else/if statements (ideally switch statements)
 * to catch the edge cases;
 */

const models = Object.keys(db).slice(0, Object.keys(db).length-2);

let options = JSON.parse(
    fs.readFileSync(__dirname + '/../../.syntactiqlrc', 'utf-8')
  )["config"];

const flattenFaker = () => {
    let cols = Object.getOwnPropertyNames(faker);
    return cols.map(c => [c, Object.keys(faker[c])]);
}

export const findMethod = (str) => {
    let cols = flattenFaker();
    let result = cols.map(c => {  
        if (c[1].includes(str)) {
            let primary = c[0];
            let n = faker[primary][str];
            if (n instanceof Function) {
                return n();
            }
        }
    })
    .filter(f => f !== undefined);
    return result[0] || faker.random.word();
}

export const buildData = () => {
    let Query = {};
    models.map(m => {
        Query[m] = {}
        let fieldType = db[m].rawAttributes;
        let fields = Object.keys(fieldType);
            fields.map(f => {
                let type =  db[m].rawAttributes[f].type.toSql();
                if (type === 'TINYINT(1)') {
                    Query[m][f] = faker.random.boolean();
                }
                else if ((f.toLowerCase()).includes('id') || f === 'createdAt' || f === 'updatedAt') {
                    return;
                } else if (f.toLowerCase().includes('date') || f.toLowerCase().includes('day')) {
                    Query[m][f] = faker.date.past().toString();
                } else {
                    Query[m][f] = findMethod(f);
                }
                
            });
        });
    return Query;
}

let limit = options.fakerCount;
export const getRandomData = (db) => [...Array(limit)].map(a => {
    return buildData()[db];
});
