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
import test from 'ava';

import { uniqueArray, flattenArray, concatArrays } from '../dist--mjs';

test('uniqueArray', t => {
  const results = uniqueArray([1, 2, 2, 3]);
  t.deepEqual(results, [1, 2, 3]);
});

test('flattenArray', t => {
  const results = flattenArray([
    [1, 2, 3],
    [4, 5, 6],
  ]);
  t.deepEqual(results, [1, 2, 3, 4, 5, 6]);
});

test('concatArrays', t => {
  const results = concatArrays([1, 2, 3], ['yes', 'ok', 'maybe']);
  t.deepEqual(results, [1, 2, 3, 'yes', 'ok', 'maybe']);
});
