require('babel-core/register');

var assert = require('assert');
const { singularize, pluralize } = require('../strings');

describe('String Manipulation', () => {
    describe('Singularize', () => {
        it('makes a plural word singular', () => {
            assert.equal('Test', singularize('Tests'));
        });
        it('keeps a singular word singular', () => {
            assert.equal('Test', singularize('Test'));
        });
    });
    describe('Pluralize', () => {
        it('makes a singular word plural', () => {
            assert.equal('Tests', pluralize('Test'));
        });
        it('keeps a plural word plural', () => {
            assert.equal('Tests', pluralize('Tests'));
        });
    });
});

