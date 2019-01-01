/** @module utils */

/**
 * Flatten Array
 * @param {Array[]} arrayOfArrays - Array of Arrays to flatten
 * @returns {Array} - Flattened array
 */
export function flattenArray(arrayOfArrays) {
  return [].concat(...arrayOfArrays);
}

/**
 * Concat Arrays together
 * @param {Array} a - First Array
 * @param {Array} b - Second Array
 * @returns {Array} - The two arrays together.
 */
export function concatArrays(a, b) {
  return [].concat(a, b);
}

/**
 * Make an array unique by removing duplicate entries.
 * @param {Array} ar - Array to make unique
 * @returns {Array} - A unique array
 */
export function uniqueArray(ar) {
  const j = {};
  ar.forEach(v => {
    j[`${v}::${typeof v}`] = v;
  });
  return Object.keys(j).map(v => j[v]);
}
