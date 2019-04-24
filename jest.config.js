module.exports = {
  setupFiles: ['<rootDir>/jest.init.js'],
  testPathIgnorePatterns: [
    'node_modules',
    'vendor',
    'dist',
    'verdaccio',
    'cypress',
  ],
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.js$': 'babel-jest',
  },
  verbose: true,
};
