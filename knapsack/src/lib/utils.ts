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
import {
  validateDataAgainstSchema,
  validateSchema,
} from '@knapsack/schema-utils';
import { GenericResponse } from '@knapsack/core/types';
import specSlotsSchema from '../json-schemas/schemaKsTemplateSpecSlots';
import { KsTemplateSpec } from '../schemas/patterns';

export function validateSpec(spec: KsTemplateSpec): GenericResponse {
  let ok = true;
  const msgs: string[] = [];

  if (spec?.props) {
    const result = validateSchema(spec.props);
    if (!result.ok) {
      ok = false;
      msgs.push('Invalid "spec.props":');
      msgs.push(result.message);
    }
  }

  if (spec?.slots) {
    const result = validateDataAgainstSchema(specSlotsSchema, spec.slots);
    if (!result.ok) {
      ok = false;
      msgs.push('Invalid "spec.slots":');
      msgs.push(result.message);
      result.errors.forEach(e => msgs.push(e.message));
    }
  }

  return {
    ok,
    message: msgs.join('\n'),
  };
}

/**
 * Is Some Of This Array In That Array?
 * Are any of the items in arrayA in arrayB?
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasItemsInItems(arrayA: any[], arrayB: any[]): boolean {
  return arrayA.some(a => arrayB.includes(a));
}

/**
 * Make an array unique by removing duplicate entries.
 * @param {Array} ar - Array to make unique
 * @returns {Array} - A unique array
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function uniqueArray(ar: any[]): any[] {
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
export function flattenNestedArray<T>(arr: T[]): T[] {
  return arr.reduce(
    (flat, toFlatten) =>
      flat.concat(
        Array.isArray(toFlatten) ? flattenNestedArray(toFlatten) : toFlatten,
      ),
    [],
  );
}

export function flattenArray<T>(arrayOfArrays: T[][]): T[] {
  return [].concat(...arrayOfArrays);
}

export function isBase64(
  v: any,
  { mimeRequired = false, allowMime = true } = {},
): boolean {
  if (v instanceof Boolean || typeof v === 'boolean') {
    return false;
  }

  // if (!(opts instanceof Object)) {
  //   opts = {};
  // }
  //
  // if (opts.allowEmpty === false && v === '') {
  //   return false;
  // }

  let regex =
    '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?';
  const mimeRegex = '(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)';

  if (mimeRequired === true) {
    regex = mimeRegex + regex;
  } else if (allowMime === true) {
    regex = `${mimeRegex}?${regex}`;
  }

  // if (opts.paddingRequired === false) {
  //   regex =
  //     '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}(==)?|[A-Za-z0-9+\\/]{3}=?)?';
  // }

  const result = new RegExp(`^${regex}$`, 'gi').test(v);

  return result;
}

export function timer(): () => number {
  const startTime = new Date().getTime();
  return () => {
    const endTime = new Date().getTime();
    return (endTime - startTime) / 1000;
  };
}
