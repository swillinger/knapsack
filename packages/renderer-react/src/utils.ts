import { log } from '@basalt/knapsack';
import fs from 'fs-extra';
import path from 'path';

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
