/**
 *  Copyright (C) 2018 Basalt
    This file is part of Bedrock.
    Bedrock is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Bedrock is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Bedrock; if not, see <https://www.gnu.org/licenses>.
 */
const Ajv = require('ajv'); // https://github.com/epoberezkin/ajv

const ajv = new Ajv();

const ajvDefaults = new Ajv({
  useDefaults: true,
});

/**
 * Validate Schema itself (metaSchema)
 * Validates against contents of the `$schema` field
 * @link https://github.com/epoberezkin/ajv#validateschemaobject-schema---boolean
 * @param {Object} schema - JSON Schema
 * @return {{ok: boolean, message: string}} - True if valid
 */
function validateSchema(schema) {
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
 * @param {Object} schema - JSON Schema
 * @param {Object} data - Data to validate
 * @return {{ok: boolean, message: string, data: Object}} - Results
 */
function validateSchemaAndAssignDefaults(schema, data) {
  const { ok, message } = validateSchema(schema);
  if (!ok) {
    return {
      ok: false,
      message,
      data,
    };
  }

  const newData = Object.assign({}, data);
  // This `validate` function mutates `newData`, so that's why we created a new object above first.
  const isValid = ajvDefaults.validate(schema, newData);
  return {
    ok: isValid,
    message: isValid ? '' : ajvDefaults.errorsText(),
    data: newData,
  };
}

/**
 * Validate Data against Schema
 * @link https://github.com/epoberezkin/ajv
 * @param {Object} schema - JSON Schema
 * @param {Object} data - Data to validate
 * @return {{ok: boolean, message: string}} - Results
 */
function validateDataAgainstSchema(schema, data) {
  const { ok, message } = validateSchema(schema);
  if (!ok) {
    return {
      ok: false,
      message,
    };
  }

  const isValid = ajv.validate(schema, data);
  return {
    ok: isValid,
    message: isValid ? '' : ajv.errorsText(),
  };
}

module.exports = {
  validateSchema,
  validateSchemaAndAssignDefaults,
  validateDataAgainstSchema,
};
