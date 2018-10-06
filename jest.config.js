module.exports = {
  setupFiles: ['<rootDir>/jest.init.js'],
  testPathIgnorePatterns: ['node_modules', 'vendor', 'dist'],
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.js$': 'babel-jest',
  },
  verbose: true,
};
