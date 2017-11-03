/**
 * An instance of the store is created here. 
 * The store is not like the redux store, but rather 
 * a caching layer for requests;
 */
import Memoize from '../utils/Memoize';

const store = new Memoize({});

export default store;