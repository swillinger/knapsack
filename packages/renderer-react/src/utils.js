const { log } = require('@basalt/bedrock');
const fs = require('fs-extra');
const path = require('path');

/**
 * @param {string} fileName - path to where JSON file should be read
 * @return {Object}
 */
const readJsonSync = fileName => JSON.parse(fs.readFileSync(fileName, 'utf8'));

/**
 * Get a NPM package's package.json as object
 * @param {string} pkg
 * @return {Object} - The package.json
 */
function getPkg(pkg) {
  const pkgPath = require.resolve(`${pkg}/package.json`, {
    paths: [process.cwd()],
  });
  return readJsonSync(pkgPath);
}

/**
 * @param {string} distDirAbsolute
 * @param {string} publicPath
 * @return {string[]}
 */
function copyReactAssets(distDirAbsolute, publicPath) {
  try {
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

module.exports = {
  copyReactAssets,
};
