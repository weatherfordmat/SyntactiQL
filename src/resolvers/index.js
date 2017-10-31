import fs from 'fs';
import path from 'path';
import db from '../models';

// graphql
import { makeExecutableSchema } from 'graphql-tools';

// config
let options = JSON.parse(
    fs.readFileSync(__dirname + '/../../.syntactiqlrc', 'utf-8')
  )["config"];

const schemaFile = path.join(__dirname, `../schema/${options.schemaName}`);
const typeDefs = fs.readFileSync(schemaFile, 'utf8');

// import Instance of store;
import store from '../store';

// db wrappers;
import { createAssociations, createMeta, createQueries, createMutations } from './methods';
      
/**
 * We create our resolvers by calling our createResolver functions in /methods
 * while also passing an instance of store into our functions;
 * 
 * It's important that we don't duplicate store by re-requiring the Memoize file
 * and calling a new instance of store.
 */

const resolvers = {
    Query: createQueries(store),
    Meta: createMeta(store),
    Mutation: createMutations(store)
};

// add association queries to resolver object;
let associations = createAssociations();
Object.keys(associations).map(m => {
    resolvers[m] = associations[m];
});

export default makeExecutableSchema({ 
    typeDefs, 
    resolvers
});
