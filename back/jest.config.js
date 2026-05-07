export default {
  testEnvironment: 'node',
  testMatch: ["**/__tests__/**/*.test.js"], // Only look for files ending with .test.js in __tests__ folders
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.js"], // Run this file after the test environment is set up
  transform: {},
};