/**
 * Pluralize String
 */
export function pluralize(s) {
    let lastLetter = s.substring(s.length-1, s.length) 
    if (lastLetter === 's') {
        return s;
    } else {
        return `${s}s`;
    }
}

/**
 * Singularize String
 */
export function singularize(s) {
    let lastLetter = s.substring(s.length-1, s.length) 
    if (lastLetter === 's') {
        return s.substring(0, s.length - 1);
    } else {
        return s;
    }
}