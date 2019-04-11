module.exports = api => {
  api.cache(false);
  return {
    extends: '@basalt/knapsack-babel-config',
  };
};
