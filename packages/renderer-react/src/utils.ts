import { log } from '@knapsack/app';
import { formatCode } from '@knapsack/app/dist/server/server-utils';
import fs from 'fs-extra';
import path from 'path';
import { compile } from 'ejs';
import { readFileSync } from 'fs';

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
    log.error(
      'Error trying to copy "react" and "react-dom" JS files, are they installed? We want to use your exact versions.',
      error,
      'templateRenderer:react',
    );
    process.exit(1);
  }
}
