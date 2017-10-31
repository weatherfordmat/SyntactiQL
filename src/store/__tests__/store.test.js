require('babel-core/register');

var assert = require('assert');
const store = require('../index').default;

describe('Store', () => {
  describe('initialState', () => {
    it('has no keys/value pairs', () => {
      assert.equal(true, !Object.keys(store.getStore()).length);
    });
  });
  describe('adding, mutating, and clearning values', () => {
    it ('contains the added value "result"', () => {
      store.setKey('test', 'result');
      assert.equal('result', store.getKey('test'));
    });
    it ('can mutate an existing key/value pair', () => {
        store.setKey('test', 'result');
        store.setKey('test', 'second-result');
        assert.equal('second-result', store.getKey('test'));
    });
    it ('can delete an existing key/value pair', () => {
      store.setKey('test', 'result');
      store.clearKey('test');
      assert.equal(null, store.getKey('test'));
    });
    it ('can clear all added keys', () => {
        store.setKey('test', 'result');
        store.setKey('test2', 'result2');
        store.clearCache();
        assert.equal(true, !Object.keys(store.getStore()).length);
    });
  });
});