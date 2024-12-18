export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.app.json',
    }],
  },
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '^@api(.*)$': '<rootDir>/src/api$1'
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};