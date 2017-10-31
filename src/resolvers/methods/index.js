import db from '../../models';

// utilities;
import orderBy from 'lodash.orderby';
import { pluralize, singularize } from '../../utils/strings';


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
export const createInstance = async (_, body, context, { returnType }, store) => {
    let storeKey = returnType.toString();
    let loaders = Object.keys(context).filter(c => c.toString().toLowerCase().includes(storeKey.toLowerCase()));
    
    // reset cache;
    loaders.map(l => context[l].clearAll());
    store.clearKey(storeKey);
    
    let t = getDB(storeKey);

    return await db[t].create(body)
}

// Read
export const findAll = async ({ limit=750, offset=0, sortField='id', sortOrder='ASC' },{ returnType }) => {
    let t = getDB(returnType.toString()); 
    return orderBy(
        await db[t].findAll({ limit, offset }), 
        [sortField],
        [sortOrder.toLowerCase()]
    );
}

export const findById = async ({ id }, { returnType }) => {
    let t = getDB(returnType.toString());
    return await db[t].findById(id);
}

// Looks for Data in Store first then runs "expensive" query
// if needed
export const getMetaData = async (key, store) => {
    if (store.getKey(key)) {
        return store.getKey(key);
    } else {
        let t = getDB(key);
        let len = await db[t].count({});
        store.setKey(key, len)
        return len;
    }
}

// Delete
export const deleteRecord = async(id, table) => {
    let t = getDB(table);
    let copy = await (db[t]).findById(id);
    await db[t].destroy({ where: { id }});
    return copy;
}

/* ---------------- Helpers ------------------- */
export const getDB = (table) => {
    table = table.replace(/\[/g, '').replace(/\]/g, '');
    if (Object.keys(db).includes(table)) {
        var t = table;
    } else if (Object.keys(db).includes(pluralize(table))) {
        t = pluralize(table);
    } else {
        t = singularize(table);
    }
    return t;
}


/* ---------------- Create Resolvers ------------------- */
export const createQueries = (store) => {
    let Query = {};

    const models = Object.keys(db).slice(0, Object.keys(db).length-2);
    let getById = models.map(m => singularize(m));
       
    models
        .map(m => {
            Query[singularize(m)] = (args, $, {}, i) => findById($, i);
            Query[pluralize(m)] = (args, $, {}, i) => findAll($, i);
            Query[`${pluralize(m)}Meta`] = (_, {}, {}, { fieldName }) => pluralize(m)
        });

    return Query;
}

export const createMeta = (store) => {
    let Meta = {};
    Meta["count"] = (x) => getMetaData(x, store);
    return Meta;
}

export const createMutations = (store) => {
    let Mutation = {};

    const models = Object.keys(db).slice(0, Object.keys(db).length-2);

    models 
        .map(m => {
            let thisModel = singularize(m).charAt(0).toUpperCase() + singularize(m).slice(1).toLowerCase();
            Mutation[`create${thisModel}`] = (a, body, c, info) => createInstance(_, body, c, info, store);
            Mutation[`delete${thisModel}`] = (a, { id }, c, { returnType }) =>  deleteRecord(id, returnType.toString());
        });

    return Mutation;
}

export const createAssociations = () => {
    let Association = {};
   
    const models = Object.keys(db).slice(0, Object.keys(db).length-2);

    models.map(m => {
        Association[singularize(m)] = {};
        let i = 0;
        while (i < Object.keys(db[m].associations).length) {

            let association = Object.keys(db[m].associations)[i];
            let manyRelation = association.includes('-');
            let associationName = manyRelation ? association.split('-')[0] : association;
            let loaderPrefix = manyRelation ? association.split('-')[1] : association;
            let loaderName = `${singularize(loaderPrefix).toLowerCase()}Loader`

            let key;
            if (manyRelation) {
                key = `${loaderPrefix}Id`;
            } else {
                key = 'id';
            }

            Association[singularize(m)][singularize(associationName)] = (obj, _, info) => {
                if (obj[key]) return info[loaderName].load(obj[key]);
            }

            i++;
        }
    });

    return Association;
}