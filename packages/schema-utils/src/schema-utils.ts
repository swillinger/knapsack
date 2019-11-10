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
import Ajv from 'ajv'; // https://github.com/epoberezkin/ajv

export const ajv = new Ajv();

type ajvErrors = import('ajv').ErrorObject[];

const ajvDefaults = new Ajv({
  useDefaults: true,
});

/**
 * Validate Schema itself (metaSchema)
 * Validates against contents of the `$schema` field
 * @link https://github.com/epoberezkin/ajv#validateschemaobject-schema---boolean
 */
export function validateSchema(schema: {}): { ok: boolean; message: string } {
  const isSchemaValid = ajv.validateSchema(schema);
  return {
    ok: isSchemaValid,
    message: isSchemaValid
      ? ''
      : `Schema itself is not valid. ${ajv.errorsText()}`,
  };
}

/**
 * Validate Schema and Assign Defaults
 * Any `default` on properties will be added if that property is absent
 * @link https://github.com/epoberezkin/ajv#assigning-defaults
 */
export function validateSchemaAndAssignDefaults<T>(
  schema: {},
  data: T,
): { ok: boolean; message: string; data: T } {
  const { ok, message } = validateSchema(schema);
  if (!ok) {
    return {
      ok: false,
      message,
      data,
    };
  }

  const newData = { ...data };
  // This `validate` function mutates `newData`, so that's why we created a new object above first.
  const isValid = !!ajvDefaults.validate(schema, newData);
  return {
    ok: isValid,
    message: isValid ? '' : ajvDefaults.errorsText(),
    data: newData,
  };
}

/**
 * Validate Data against Schema
 * @link https://github.com/epoberezkin/ajv
 */
export function validateDataAgainstSchema(
  schema: {},
  data: object,
): {
  ok: boolean;
  message: string;
  errors?: ajvErrors;
} {
  const { ok, message } = validateSchema(schema);
  if (!ok) {
    return {
      ok: false,
      message,
    };
  }

  const isValid = !!ajv.validate(schema, data);
  return {
    ok: isValid,
    message: isValid ? '' : ajv.errorsText(),
    errors: isValid ? [] : ajv.errors,
  };
}

/**
 * Used to ensure that the `id` prop in each object in an array is unique
 */
export function validateUniqueIdsInArray<T>(
  items: T[],
  key = 'id',
): {
  ok: boolean;
  duplicates: T[];
  duplicateIdList: string;
  message: string;
} {
  const ids = [];
  const duplicates = [];
  items.forEach(item => {
    if (ids.includes(item[key])) {
      duplicates.push(item);
    } else {
      ids.push(item[key]);
    }
  });
  if (duplicates.length > 0) {
    const duplicateIdList = duplicates.map(d => `"${d[key]}"`).join(', ');
    return {
      ok: false,
      duplicates,
      duplicateIdList,
      message: `Each item in the array requires unique "${key}" prop. These ids are duplicates: ${duplicateIdList}`,
    };
  }
  return {
    ok: true,
    duplicates,
    duplicateIdList: '',
    message: '',
  };
}
