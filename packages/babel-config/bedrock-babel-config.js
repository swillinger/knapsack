function presets(useESModules) {
  return [
    [
      require.resolve('@babel/preset-env'),
      {
        modules: useESModules ? false : 'commonjs',
        targets: {
          browsers: ['last 2 versions', '> 5%', 'not ie <= 11'],
        },
      },
    ],
    require.resolve('@babel/preset-react'),
  ];
}

module.exports = (useESModules = false) => ({
  presets: presets(useESModules),
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
});
