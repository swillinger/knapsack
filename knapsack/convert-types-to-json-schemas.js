#!/usr/bin/env node
const TJS = require('typescript-json-schema'); // https://github.com/YousefED/typescript-json-schema
const { resolve, relative, join } = require('path');
const { writeFile, readdirSync, remove } = require('fs-extra');

console.log('Start: converting TypeScript types to JSON Schemas');

// To generate JSON schemas in the `distDir` folder, place any types in the `typesFile`, then add them to the `typeNamesToExportToJsonSchema` below.

const distDir = join(__dirname, `./src/json-schemas/`);
const typesFile = join(__dirname, './src/schemas/types-to-json-schemas.d.ts');
const typeNamesToExportToJsonSchema = [
  'KnapsackSettings',
  'KnapsackCustomPageSettingsForm',
  'KnapsackAssetSetsConfig',
  'KnapsackPattern',
  'KnapsackNavsConfig',
];
const fileNamePrefix = 'schema';
const deleteUnusedFilesAfter = false;

const oldFilesToDeleteAfter = new Set(readdirSync(distDir));

/** @type {import('TJS').PartialArgs} */
const settings = {
  required: true,
  titles: false,
  noExtraProps: true,
  ignoreErrors: true,
  typeOfKeyword: false,
  refs: false,
};

// see validationKeywords: https://github.com/YousefED/typescript-json-schema/blob/master/typescript-json-schema.ts#L254

// optionally pass ts compiler options
/** @type {import('TJS').CompilerOptions} */
const compilerOptions = {};

// optionally pass a base path
const basePath = resolve(__dirname, './src');

const program = TJS.getProgramFromFiles([typesFile], compilerOptions, basePath);

const generator = TJS.buildGenerator(program, settings);

class CustomError extends Error {
  constructor(type, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.name = 'CustomError';
    // Custom debugging information
    this.type = type;
  }
}

async function go() {
  const schemas = await Promise.all(
    typeNamesToExportToJsonSchema.map(async type => {
      try {
        const schema = generator.getSchemaForSymbol(type);
        return {
          type,
          schema,
        };
      } catch (e) {
        throw new CustomError(type, e);
      }
    }),
  ).catch(e => {
    console.log();
    if (e instanceof CustomError) {
      console.error(`${e.message}
please fix by doing one of the below resolutions:
1) Ensure "${e.type}" is available in the types file at:
${relative(process.cwd(), typesFile)}

2) Remove "${
        e.type
      }" from the "typeNamesToExportToJsonSchema" array in this file:
${relative(process.cwd(), __filename)}
`);
    } else {
      console.log('b');
    }
    console.log('Failed: converting TypeScript types to JSON Schemas');
    process.exit(1);
  });

  await Promise.all(
    schemas.map(async ({ type, schema }) => {
      const schemaString = JSON.stringify(schema, null, '  ');
      const jsFile = `export default ${schemaString};`;
      const fileNameBase = `${fileNamePrefix}${type}`;
      const filePath = resolve(distDir, fileNameBase);
      const tsPath = `${filePath}.ts`;
      await writeFile(tsPath, jsFile);
      const jsonPath = `${filePath}.json`;
      await writeFile(jsonPath, schemaString);
      console.log(
        `Used typescript type "${type}" to generate JSON Schema at: "${relative(
          __dirname,
          tsPath,
        )}"`,
      );
      // remove the file we just made from the cleanup list
      oldFilesToDeleteAfter.delete(tsPath);
      oldFilesToDeleteAfter.delete(jsonPath);
    }),
  );

  if (deleteUnusedFilesAfter) {
    await Promise.all(
      [...oldFilesToDeleteAfter]
        .map(f => resolve(distDir, f))
        .map(f => remove(f)),
    );
  }

  console.log('Done: converting TypeScript types to JSON Schemas');
}

go();
