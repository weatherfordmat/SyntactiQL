require('babel-core/register');

var assert = require('assert');
var sinon = require('sinon');
const { error, info, warning, success } = require('../log');

describe('Logging Utility', () => {
    it('info logs the correct value', () => {
        let spy = sinon.spy(console, 'log');
        info('Info Log');
        assert.equal(true, spy.calledWith('Info Log'));
        spy.restore();
    });

    it('error logs the correct value', () => {
        let spy = sinon.spy(console, 'log');
        error('Sample Error Log');
        assert.equal(true, spy.calledWith('Sample Error Log'));
        spy.restore();
    });

    it('warning logs the correct value', () => {
        let spy = sinon.spy(console, 'log');
        error('Sample Warning Log');
        assert.equal(true, spy.calledWith('Sample Warning Log'));
        spy.restore();
    });

    it('success logs the correct value', () => {
        let spy = sinon.spy(console, 'log');
        error('Sample Success Log');
        assert.equal(true, spy.calledWith('Sample Success Log'));
        spy.restore();
    });

    it('success logs the correct value', () => {
        let spy = sinon.spy(console, 'log');
        error('Sample Success Log');
        assert.equal(true, spy.calledWith('Sample Success Log'));
        spy.restore();
    });
});