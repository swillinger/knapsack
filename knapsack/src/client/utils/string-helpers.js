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
/**
 * This function takes a string and escapes any regex related characters
 * Intended to be used to "cleanse" user input of regex that causes failures when using string operators
 * @param {string} string - string with potential regex characters that need to be escaped
 * @returns {string}
 */
export function escapeRegEx(string) {
  return string.replace(/[*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Basic "fuzzy" search of one string within another.
 * Both the haystack and needle are escaped for regex characters, then converted to lower case
 * If the needle appears in the haystack, will return true, otherwise returns false
 * @param {string} haystack - string to seach within
 * @param {string} needle - string being searched for
 * @returns {boolean}
 */
export function containsString(haystack, needle) {
  const needleNormalized = escapeRegEx(needle).toLowerCase();
  const haystackNormalized = escapeRegEx(haystack).toLowerCase();
  return haystackNormalized.search(needleNormalized) !== -1;
}
