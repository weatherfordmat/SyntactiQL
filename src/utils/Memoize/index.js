/**
 * Simple constructor for creating a caching layer;
 */
class Memoize {
    constructor(data) {
        this.data = {}
    }
    getStore() {
        return this.data;
    }
    getKey(key) {
        return this.data[key]
    }
    setKey(key, value) {
        this.data[key] = value;
    }
    clearKey(key) {
        delete this.data[key];
    }
    clearCache() {
        this.data = {};
    }
}

export default Memoize;

