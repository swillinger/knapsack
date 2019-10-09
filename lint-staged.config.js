module.exports = {
  linters: {
    '*.{js,jsx}': ['eslint --ext .js,.jsx --fix', 'git add'],
    '*.scss': ['stylelint --fix', 'git add'],
  },
  ignore: [],
};
