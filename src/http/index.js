import { error, info, success, warning, describe } from '../utils/log';
import { singularize } from '../utils/strings';
import path from 'path';

// gql;
import ExecutableSchema from '../resolvers';
const graphqlHTTP = require('koa-graphql');

// dataloader;
import Dataloader from 'dataloader';
import loaders from '../loaders'
import db from '../../../../sequelize/models';

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


const KoaGQL = (file) => {
    let context = {};
    Object.keys(loaders).map(l => {
        let loaderName = `${singularize(l).toLowerCase()}Loader`.replace(/batch/g, '')
        context[loaderName] = new Dataloader(keys => loaders[l](keys, db));
    });
    
    let schema = ExecutableSchema(file);
    let gql = graphqlHTTP({
        schema,
        graphiql: process.env.NODE_ENV === 'development',
        context
    });
    return gql;
}

export default KoaGQL;
