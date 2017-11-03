'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Memoize = require('../utils/Memoize');

var _Memoize2 = _interopRequireDefault(_Memoize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const store = new _Memoize2.default({}); /**
                                          * An instance of the store is created here. 
                                          * The store is not like the redux store, but rather 
                                          * a caching layer for requests;
                                          */
exports.default = store;