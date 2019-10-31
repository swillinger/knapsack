/** @module utils */

/**
 * Flatten Array
 */
export function flattenArray<T>(arrayOfArrays: T[][]): T[] {
  return [].concat(...arrayOfArrays);
}

/**
 * Concat Arrays together
 */
export function concatArrays<TA, TB>(arrayA: TA[], arrayB: TB[]): (TA | TB)[] {
  return [].concat(arrayA, arrayB);
}

/**
 * Make an array unique by removing duplicate entries.
 * @param ar - Array to make unique
 * @returns A unique array
 */
export function uniqueArray<T>(ar: T[]): T[] {
  const j = {};
  ar.forEach(v => {
    j[`${v}::${typeof v}`] = v;
  });
  return Object.keys(j).map(v => j[v]);
}
