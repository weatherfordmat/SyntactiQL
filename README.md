
# TactiQL
Builds A GraphQL Schema and Server from Your Database Models

<img width="150" alt="logo" src="https://user-images.githubusercontent.com/13956201/32232205-86a0a138-be25-11e7-9d41-46efd1cc4141.png">

## About this project

TactiQL (pronounced Tactical) was built from a frustation about the amount of boilerplate needed to get a reliable GraphQL backend up and running. So I built _TactiQL_, which is nothing other than a coherent set of methods for creating all the necessary parts of a GraphQL server. In short, this project aims to provide a more customizable Backend-As-A-Library.

All you have to do is create your sequelize models, run the transformers (createSchema and createSeedData), and start your server. With the example code, you can be testing queries in minutes. It creates your resolvers, DataLoaders, sequelize queries, etc.

## Philosophy

The parts of a well designed program are typically modular and de-coupled. Replacing a part of a program which is too tightly bound to another part spells trouble for maintainers.

So why would I write a project that espouses the tightest coupling between the models and controllers, between the API and the backend, and between sequelize and GraphQL servers? The answer is simply because of *convenience*. What's even better than a replaceable backend is a backend which affords the developers flexibility in defining their models continuously and an API which responds directly to these changes.

I believe that a project like create-react-app or even Expo are efficient because a certain level of configuration is assumed. Of course, these assumptions are a trade-off. A blank project is fully configurable, but often leads to creating the same boilerplate again and again.

## Components

_Node_ has an advantage over other backend langauges because it natively "speaks" JSON. Even more importantly, however, are the numerous libraries available to the community.

_Koa_ First implementation of the server backend code. I will quickly add others for node, including Express and Hapi. 

_GraphQL_ I am optimistic about the future of GraphQL. Don't take this as an indictment of a REST services.

_DataLoader_ A great caching and batching tool for subqueries.

_Instant Cloud Integration_ This service will seamlessly integrate with cloud service providers, starting with AWS. This feature should be implemented by 2018.

_Sequelize_ For now, I have coupled Sequelize to this project, but the file system is prepared for other ORMS. I would even like to integrate MongoDB in soon.

## Getting Started

The CLI tool is almost done for quicker scaffolding and a package that can call its utility functions. For now, the directory structure is opinionated:

```

-public
-schema
-sequelize
    --config
          ---config.json
          ---sequelize.js
    --migrations
    --models
    --seeders
-node_modules

```

The settings for this library should be added in a .tactiqlrc file at the root of your project.

``` javascript
{
    "config": {
        "colors": true, // log colors to stdout
        "logging": ["error", "describe", "info", "warning", "success"], // which types of logs you want
        "dbLogs": true, // do you want to see the actual SQL query run
        "fakerCount": 9500, // how much fake data to generate
        "schemaName": "schema.graphql", // the same of your schema file
        "sequelize": true // whether you are using sequelize
    }
}
```



Installing the package is simple:

``` javascript
yarn add tactiql

// or if you don't use yarn
npm install tactiql --save
```

Make sure to create your schema by running:
``` javascript
let { CreateSchema  } = require('tactiql');

CreateSchema('./schema/schema.graphql');
```

You can also add sample data that populates both the DB and the API by running the following
``` javascript
let { CreateRandomSeedData } = require('tactiql');

CreateRandomSeedData();
```

Right now, the library supports koa servers. A simple server might look like the following:

``` javascript
const Koa = require('koa');
const mount = require('koa-mount');
const path = require('path');

let { KoaGQL, OnServerStart } = require('tactiql');
let { error, success, describe } = require('tactiql/lib/utils/log');

// constants;
const PORT = process.env.PORT || 3000;
const imagePath = path.join(__dirname, './public/logo.png');

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
            error(err);
        })
});

app.use(mount(
        '/graphql', 
        KoaGQL('./schema/schema.graphql')
));

app.listen(PORT, () => {
    success(`App listening on port ${PORT}`);
    OnServerStart(imagePath, PORT);
});
```

You can then open your browser at http://localhost:3000/graphiql

## Methods

_Loaders_ gives you an array of your loaders for each of your associations. For now, this isn't too helpful, but when this is integrated into a cloud system, we will be able to add hooks, custom foreign keys, etc.

_CreateSchema_ creates your schema.graphql file from your sequelize models. Also syncs the database with the newest models.

_ExecutableSchema_ takes a path to your schema file and creates an "executable schema," i.e. combines your data fetching with your type definitions.

_CreateRandomSeedData_ this uses faker.js to populate your database. For now the mapping between fields is simplistic.

_KoaGQL_ Pass in the path to the .graphql file and it creates the executable schema which can be used directly by Koa.

_OnServerStart_ A notification for when the server has started. Provides a link to graphiql in dev mode.

## To-Do List
- [ ] A Front-End For Editing Models;
- [ ] Add Update Methods;  
- [ ] Add Unit Tests (partially done);  
- [ ] Add support for Express and Hapi;  
- [ ] Add Instant Cloud Integration;  
- [ ] Write Logs to File System; 
- [x] Add Logo 
- [ ] Make Schema File Name Configurable

## Gotchas

When defining an association on a class model in Sequelize, you _must_ follow a pattern. _HasOne_ and _BelongsTo_ associations should use an alias, and the alias should include a hyphen. The word before the hyphen is the name to be used in Graphql queries, while the word after the dash is what it references.

``` javascript
{
    classMethods: {
      associate: function(models) {
        models.Posts.hasOne(models.User, { as: 'Author-User'});
      }
    }
  }
```

Note that if you don't want to use an alias in your GraphQL queries, you should can write your code in the following way:
``` javascript
{
    classMethods: {
      associate: function(models) {
        models.Posts.hasOne(models.User, { as: 'User-User'});
      }
    }
  }
```

All other association types (e.g. _hasMany_) should not use aliases or custom foreign keys. This is temporary.

## Contributions

PR's are welcome either as repsonses to issues or feature addons.

## Contributors

@weatherfordmat

## License

The MIT License

Copyright (c) 2017 Matthew B. Weatherford

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
