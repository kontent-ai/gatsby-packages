module.exports = {
  testEnvironment: 'node',
  testRegex: '(/__tests__/.+\\.(test|spec))\\.js?$',
  collectCoverage: true,
  coverageReporters: ['lcov'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!/node_modules/**',
    '!/vendor/**',
    '!src/__tests__/**',
  ],
};
