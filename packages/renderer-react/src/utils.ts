import { log } from '@knapsack/app';
import { formatCode } from '@knapsack/app/dist/server/server-utils';
import { validateSchema } from '@knapsack/schema-utils';
import path from 'path';
import { compile } from 'ejs';
import fs, { readFileSync, readFile, exists, existsSync } from 'fs-extra';
import * as reactDocs from 'react-docgen';
import * as rdTs from 'react-docgen-typescript';
import { JsonSchemaObject } from '@knapsack/core/src/types';
import { KsTemplateSpec } from '@knapsack/app/dist/schemas/patterns';

/**
 * The name of the type, which is usually corresponds to the function name in `React.PropTypes`. However, for types define with `oneOf`, we use `"enum"` and for `oneOfType` we use `"union"`. If a custom function is provided or the type cannot be resolved to anything of `React.PropTypes`, we use `"custom"`.
 */
type RdTypeName =
  | 'number'
  | 'string'
  | 'custom'
  | 'union'
  | 'bool'
  | 'node'
  | 'func';

/**
 * Some types accept parameters which define the type in more detail (such as `arrayOf`, `instanceOf`, `oneOf`, etc). Those are stored in `<typeValue>`. The data type of `<typeValue>` depends on the type definition.
 */
type RdTypeValue = string;

type RdProps = {
  [prop: string]: {
    defaultValue?: {
      value: string;
      computed: boolean;
    };
    type: {
      name: RdTypeName;
      value?: RdTypeValue;
      raw?: string;
    };
    flowType?: string;
    tsType?: string;
    description?: string;
    required: boolean;
  };
};

type RdResults = {
  /**
   * Name of function, class, or const
   */
  displayName: string;
  description?: string;
  props: RdProps;
};

const renderUsageTemplate = compile(
  readFileSync(path.join(__dirname, 'template.react.ejs'), 'utf8'),
  {
    filename: 'template.react.ejs',
    async: true,
  },
);

const renderDemoAppTemplate = compile(
  readFileSync(path.join(__dirname, 'demo-app.jsx.ejs'), 'utf8'),
  {
    filename: 'demo-app.jsx.ejs',
    async: true,
  },
);

export async function getUsage(data: {
  templateName: string;
  props: object;
  children?: string;
  extraProps?: {
    key: string;
    value: string;
  }[];
  format?: boolean;
}): Promise<string> {
  const props = Object.keys(data.props || {}).map(key => {
    const value = data.props[key];
    return {
      key,
      value,
    };
  });

  const { templateName, children, extraProps = [] } = data;

  const attributes: string[] = props.map(({ key, value }) => {
    switch (typeof value) {
      case 'string':
        if (value.startsWith('(')) {
          // assume it's a function
          return `${key}={${value}}`;
        }
        return `${key}="${value}"`;
      case 'boolean':
        return value ? `${key}` : `${key}={${value}}`;
      default:
        return `${key}={${JSON.stringify(value)}}`;
    }
  });

  const extraAttributes: string[] = extraProps.map(
    ({ key, value }) => `${key}={${value}}`,
  );

  const result = await renderUsageTemplate({
    templateName,
    attributes: [...attributes, ...extraAttributes].join(' '),
    children,
  });
  return data.format
    ? formatCode({
        code: result,
        language: 'react',
      })
    : result.trim();
}

export async function getDemoAppUsage({
  children,
  imports,
}: {
  children: string;
  imports?: string;
}): Promise<string> {
  const code = await renderDemoAppTemplate({
    children,
    imports,
  });
  return formatCode({
    code,
    language: 'react',
  });
}

export async function getReactTypeScriptDocs({
  src,
  exportName,
}: {
  src: string;
  exportName?: string;
}): Promise<KsTemplateSpec | false> {
  const tsConfigPath = path.resolve(process.cwd(), './tsconfig.json');
  const tsConfigExists = existsSync(tsConfigPath);
  try {
    const config = {
      // shouldExtractLiteralValuesFromEnum: true,
      savePropValueAsString: true,
    };
    const parse = tsConfigExists
      ? rdTs.withCustomConfig(tsConfigPath, config).parse
      : rdTs.withDefaultConfig(config).parse;
    const results = parse(src);
    // log.inspect({ results }, 'ts results');

    if (!results) return false;

    const spec: KsTemplateSpec = {
      props: {
        $schema: 'http://json-schema.org/draft-07/schema',
        type: 'object',
        required: [],
        properties: {},
      },
      slots: {},
    };

    const isDefaultExport = !exportName || exportName === 'default';

    // if `isDefaultExport` then we just grab last result since `export default` TENDS to be last. that'll we can do really...
    const result = isDefaultExport
      ? results.pop()
      : results.find(r => r.displayName === exportName);

    // log.inspect({ result, isDefaultExport, exportName }, 'ts result');
    if (!result) return false;

    const { displayName } = result;
    spec.props.description = result.description;
    Object.entries(result.props || {}).forEach(([propName, propDef]) => {
      const {
        name,
        description,
        defaultValue,
        required,
        type,
        parent,
      } = propDef;

      // functions
      if (type?.name?.startsWith('(')) {
        spec.props.properties[propName] = {
          description: `\`${type.name}\` ${description}`,
          typeof: 'function',
          tsType: propDef?.type?.name,
        };
      }

      // enums / unions (multi-choice strings)
      if (type?.name?.includes('|')) {
        // comes in like this: `{ name: '"option1" | "option2" | "option3"' }`
        const options = type.name
          .split('|')
          .map(enumItem => enumItem.trim()?.replace(/"/g, ''))
          .filter(Boolean);

        if (options?.length) {
          spec.props.properties[propName] = {
            type: 'string',
            enum: options,
          };
        }
      }

      switch (type?.name) {
        case 'string':
          spec.props.properties[propName] = {
            type: 'string',
          };
          break;
        case 'number':
          spec.props.properties[propName] = {
            type: 'number',
          };
          break;
        case 'boolean':
        case 'bool':
          spec.props.properties[propName] = {
            type: 'boolean',
          };
          break;
        case 'ReactNode':
          spec.slots[propName] = {
            title: propName,
          };
          break;
      }

      // assigning info that all would have
      if (spec.props.properties[propName]) {
        if (required) spec.props.required.push(propName);
        if (description && !spec.props.properties[propName].description) {
          spec.props.properties[propName].description = description;
        }
        if (defaultValue) {
          spec.props.properties[propName].default = defaultValue;
        }
      }

      // console.log('type', type);
    });

    return spec;
  } catch (error) {
    log.warn(
      'Could not infer spec from React TypeScript file',
      {
        src,
        exportName,
        error,
      },
      'react renderer',
    );
    return {};
  }
}
export async function getReactPropTypesDocs({
  src,
  exportName,
}: {
  src: string;
  exportName?: string;
}): Promise<KsTemplateSpec | false> {
  try {
    // console.log({reactDocs});
    const fileSrc = await readFile(src);
    const {
      findAllComponentDefinitions,
      findExportedComponentDefinition,
      findAllExportedComponentDefinitions,
    } = reactDocs.resolver;
    const results: RdResults[] = reactDocs.parse(
      fileSrc,
      findAllExportedComponentDefinitions,
      null,
      {
        filename: src,
        // babelrc: false,
      },
    );

    const isDefaultExport = !exportName || exportName === 'default';

    // if `isDefaultExport` then we just grab last result since `export default` TENDS to be last. that'll we can do really...
    const result = isDefaultExport
      ? results.pop()
      : results.find(r => r.displayName === exportName);

    // log.inspect(results, 'JSX PropTypes Results');
    // console.log(JSON.stringify(result, null, '  '));

    const spec: KsTemplateSpec = {
      isInferred: true,
      props: {
        $schema: 'http://json-schema.org/draft-07/schema',
        type: 'object',
        required: [],
        properties: {},
      },
      slots: {},
    };

    Object.entries(result.props || {}).forEach(([propName, propDef]) => {
      const { required, description, defaultValue } = propDef;
      switch (propDef?.type?.name) {
        case 'string':
          if (required) spec.props.required.push(propName);
          spec.props.properties[propName] = {
            type: 'string',
          };
          break;
        case 'func':
          if (required) spec.props.required.push(propName);
          spec.props.properties[propName] = {
            type: 'string',
          };
          break;
        case 'bool':
          if (required) spec.props.required.push(propName);
          spec.props.properties[propName] = {
            type: 'boolean',
          };
          break;
        case 'node':
          spec.slots[propName] = {
            title: propName,
            description,
          };
      }

      // assigning info that all would have
      if (spec.props.properties[propName]) {
        if (required) spec.props.required.push(propName);
        if (description && !spec.props.properties[propName].description) {
          spec.props.properties[propName].description = description;
        }
        if (defaultValue && 'value' in defaultValue) {
          spec.props.properties[propName].default = defaultValue;
        }
      }
    });

    return spec;
  } catch (error) {
    log.warn(
      'Could not infer spec from React PropTypes',
      {
        src,
        exportName,
        error,
      },
      'react renderer',
    );
    return {};
  }
}

export async function getReactDocs({
  src,
  exportName,
}: {
  src: string;
  exportName?: string;
}): Promise<KsTemplateSpec | false> {
  const { ext } = path.parse(src);
  switch (ext) {
    case '.js':
    case '.jsx':
      return getReactPropTypesDocs({ src, exportName });
    case '.ts':
    case '.tsx':
      return getReactTypeScriptDocs({ src, exportName });
  }
}

/**
 * @param fileName - path to where JSON file should be read
 */
const readJsonSync = (fileName: string): { [k: string]: any } =>
  JSON.parse(fs.readFileSync(fileName, 'utf8'));

/**
 * Get a NPM package's package.json as object
 * @param pkg The Package Name
 * @return The package.json
 */
function getPkg(pkg: string): { [k: string]: any } {
  const pkgPath = require.resolve(`${pkg}/package.json`, {
    paths: [process.cwd()],
  });
  return readJsonSync(pkgPath);
}

export function copyReactAssets(
  distDirAbsolute: string,
  publicPath: string,
): string[] {
  try {
    fs.ensureDirSync(distDirAbsolute);
    const { version: reactVersion } = getPkg('react');
    const { version: reactDomVersion } = getPkg('react-dom');

    fs.copySync(
      require.resolve(`react/umd/react.development.js`, {
        paths: [process.cwd()],
      }),
      path.join(distDirAbsolute, `react.development.${reactVersion}.js`),
    );
    fs.copySync(
      require.resolve(`react/umd/react.production.min.js`, {
        paths: [process.cwd()],
      }),
      path.join(distDirAbsolute, `react.production.min.${reactVersion}.js`),
    );
    fs.copySync(
      require.resolve(`react-dom/umd/react-dom.production.min.js`, {
        paths: [process.cwd()],
      }),
      path.join(
        distDirAbsolute,
        `react-dom.production.min.${reactDomVersion}.js`,
      ),
    );
    fs.copySync(
      require.resolve(`react-dom/umd/react-dom.development.js`, {
        paths: [process.cwd()],
      }),
      path.join(distDirAbsolute, `react-dom.development.${reactDomVersion}.js`),
    );
    const reactFileSuffix =
      process.env.NODE_ENV === 'production' ? 'production.min' : 'development';

    return [
      path.join(publicPath, `react.${reactFileSuffix}.${reactVersion}.js`),
      path.join(
        publicPath,
        `react-dom.${reactFileSuffix}.${reactDomVersion}.js`,
      ),
    ];
  } catch (error) {
    log.warn(
      'Error trying to copy "react" and "react-dom" JS files, are they installed? We want to use your exact versions.',
      error,
      'templateRenderer:react',
    );
    process.exit(1);
  }
}
