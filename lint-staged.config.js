module.exports = {
  linters: {
    '*.{js,jsx,ts,tsx}': ['yarn eslint --quiet --fix', 'git add'],
    '*.scss': ['stylelint --fix', 'git add'],
    'package.json': ['sort-npm-scripts', 'git add'],
  },
  ignore: [],
};
