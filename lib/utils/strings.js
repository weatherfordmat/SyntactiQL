'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pluralize = pluralize;
exports.singularize = singularize;
/**
 * Pluralize String
 */
function pluralize(s) {
    let lastLetter = s.substring(s.length - 1, s.length);
    if (lastLetter === 's') {
        return s;
    } else {
        return `${s}s`;
    }
}

/**
 * Singularize String
 */
function singularize(s) {
    let lastLetter = s.substring(s.length - 1, s.length);
    if (lastLetter === 's') {
        return s.substring(0, s.length - 1);
    } else {
        return s;
    }
}