/**
 *  Copyright (C) 2018 Basalt
    This file is part of Knapsack.
    Knapsack is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Knapsack is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
// IMPORTANT: Only put vanilla JavaScript in here: this should all work in the server or client

/**
 * Is Some Of This Array In That Array?
 * Are any of the items in arrayA in arrayB?
 */
export function hasItemsInItems(arrayA: any[], arrayB: any[]): boolean {
  return arrayA.some(a => arrayB.includes(a));
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

/**
 * Flatten nest array
 * @param {Array} arr
 * @return {Array}
 * @link https://stackoverflow.com/a/15030117
 */
export function flattenArray(arr) {
  return arr.reduce(
    (flat, toFlatten) =>
      flat.concat(
        Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten,
      ),
    [],
  );
}
