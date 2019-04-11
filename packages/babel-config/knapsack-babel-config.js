const isProd = process.env.NODE_ENV === 'production';

function getConfig({
  useESModules = false,
  targets = {
    browsers: isProd
      ? ['last 2 versions', '> 5%', 'not ie <= 11']
      : ['last 2 versions'],
  },
}) {
  return {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          modules: useESModules ? false : 'commonjs',
          targets,
        },
      ],
      [
        require.resolve('@babel/preset-react'),
        {
          development: process.env.NODE_ENV !== 'production',
        },
      ],
      [
        require.resolve('@babel/preset-typescript'),
        {
          isTSX: true,
          allExtensions: true,
          jsxPragma: 'React',
        },
      ],
    ],
    plugins: [
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      require.resolve('babel-plugin-transform-react-remove-prop-types'),
      require.resolve('babel-plugin-styled-components'),
      [
        // http://babeljs.io/docs/en/babel-plugin-transform-runtime
        require.resolve('@babel/plugin-transform-runtime'),
        {
          corejs: false,
          helpers: true,
          regenerator: true,
          useESModules,
        },
      ],
      require.resolve('@babel/plugin-proposal-object-rest-spread'),
      require.resolve('@babel/plugin-proposal-class-properties'),
    ],
  };
}

module.exports = (useESModules = false) => ({
  ...getConfig({ useESModules }),
  env: {
    test: getConfig({ useESModules: false, targets: { node: true } }),
    cli: getConfig({ useESModules: false, targets: { node: true } }),
  },
});
