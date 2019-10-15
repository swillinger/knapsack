module.exports = {
  linters: {
    '*.{js,jsx}': ['eslint --ext .js,.jsx --fix', 'git add'],
    '*.ts': ['eslint --config ./.eslintrc--ts.js --ext .ts --fix', 'git add'],
    '*.scss': ['stylelint --fix', 'git add'],
  },
  ignore: [],
};
