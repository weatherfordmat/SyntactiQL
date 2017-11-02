
# TactiQL
## Builds A GraphQL Schema and Server from Your Database Models

<img width="150" alt="logo" src="https://user-images.githubusercontent.com/13956201/32232205-86a0a138-be25-11e7-9d41-46efd1cc4141.png">

## About this project

TactiQL (pronounced Tactical) was built from a frustation about the amount of boilerplate needed to get a reliable GraphQL backend up and running. So I built _TactiQL_, which is nothing other than a coherent set of methods for creating all the necessary parts of a GraphQL server. In short, this project aims to provide a more customizable Backend-As-A-Library.

All you have to do is create your sequelize models, run the transformers, and start your server. With the example code, you can be testing queries in minutes. It creates your resolvers, DataLoaders, sequelize queries, etc.

## Philosophy

The parts of a well designed program are typically modular and de-coupled. Replacing a part of a program which is too tightly bound to another part spells trouble for maintainers.

So why would I write a project that espouses the tightest coupling between the models and controllers, between the API and the backend, and between sequelize and GraphQL servers? The answer is simply because of *convenience*. What's even better than a replaceable backend is a backend which affords the developers flexibility in defining their models continuously and an API which responds directly to these changes.

I believe that a project like create-react-app or even Expo are efficient because a certain level of configuration is assumed. Of course, these assumptions are a trade-off. A blank project is fully configurable, but often leads to creating the same boilerplate again and again.

## Components

_Node_ has an advantage over other backend langauges because it natively "speaks" JSON. Even more importantly, however, are the numerous libraries available to the community.

_Koa_ First implementation of the server backend code. I will quickly add others for node, including Express and Hapi. 

_GraphQL_ I am optimistic about the future of GraphQL. Don't take this as an indictment of a REST services.

_DataLoader_ A great caching and batching tool for subqueries.

_Instant Cloud Integration_ This service will seamlessly integrate with cloud service providers, starting with AWS.

_Sequelize_ For now, I have coupled Sequelize to this project, but the file system is prepared for other ORMS. I would even like to integrate MongoDB in soon.

_Mocha_ is a mature library for testing ndoe backends. 

## Getting Started

For now, the project can only be cloned directly from github. I would like to make this a CLI tool for quicker scaffolding.

``` javascript

git clone https://github.com/weatherfordmat/TactiQL.git

cd TactiQL && yarn

// if you don't have yarn you can run
npm install

// make sure to have sequelize-cli intalled globally
yarn add sequelize-cli mocha -g

// create your models
sequelize model:create --name User --attributes name:string,state:boolean,birth:date,card:integer

// this creates all the boilerplate needed for your server.
npm run init:project

// start dev server
npm run start:dev

// start the production server
npm run start:prod
```

## To-Do List
- [ ] A Front-End For Editing Models;
- [ ] Add Update Methods;  
- [ ] Add Unit Tests (partially done);  
- [ ] Add support for Express and Hapi;  
- [ ] Add Instant Cloud Integration;  
- [ ] Write Logs to File System; 
- [x] Add Logo 
- [x] Make Schema File Name Configurable

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
