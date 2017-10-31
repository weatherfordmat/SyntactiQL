require('babel-core/register');

const assert = require('assert');
const sinon = require('sinon');
const { convertSchemaType } = require('../createSchema');

describe('Conversion Functions Return correctly', () => {
    describe('Converts SQL Types to GraphQL types correctly ', () => {
        it ('Converts id to ID!', () => {
            assert.equal('ID!', convertSchemaType('id', 'int', true));
        });
        it ('Converts INTEGER to Int', () => {
            assert.equal('Int', convertSchemaType('field', 'INTEGER', false));
        });
        it ('Converts BOOLEAN/TINYINT(1) to Boolean', () => {
            assert.equal('Boolean', convertSchemaType('field', 'TINYINT(1)', false));
        });
        it ('Converts TEXT to String', () => {
            assert.equal('String', convertSchemaType('field', 'TEXT', false));
        });
    });
});
