const {jest: jestConfig} = require('kcd-scripts/config')
module.exports = Object.assign(jestConfig, {
  transform: {
    '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/src/index.ts',
    '<rootDir>/src/__tests__/setup-env.ts',
  ],
})
