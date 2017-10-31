// server
const Koa = require('koa');
const mount = require('koa-mount');
const graphqlHTTP = require('koa-graphql');

// utilities;
import { error, info, success, warning, describe } from '../utils/log';
import { singularize } from '../utils/strings';
import opn from 'opn';

// schema;
import schema from '../resolvers';

// dataloader;
import Dataloader from 'dataloader';
import loaders from '../loaders'
import db from '../models';

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

const app = new Koa();

/**
 * This will have no effect if logging is turned off;
 */
app.use((ctx, next) => {
    const start = Date.now();
    return next()
        .then(_ => {
            const ms = Date.now() - start;
            describe(`${ctx.method} ${ctx.url} - ${ms}ms`);
        })
        .catch(err => {
            error(err)
        })
});

// add batch loaders;
let context = {};
Object.keys(loaders).map(l => {
    let loaderName = `${singularize(l).toLowerCase()}Loader`.replace(/batch/g, '')
    context[loaderName] = new Dataloader(keys => loaders[l](keys, db));
});

let gql = graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
    context
});

app.use(mount('/graphql', gql));

app.listen(process.env.PORT || 3000);

// let hasOpened = false;
// if (process.env.NODE_ENV === 'development' && !hasOpened) {
//     hasOpened = true;
//     opn('http://localhost:3000/graphql');
// }


