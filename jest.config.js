module.exports = {
  testEnvironment: "node",
  modulePathIgnorePatterns: [
    "<rootDir>/node_modules",
    "<rootDir>/../lib/"
  ],
  testMatch: [
    "<rootDir>/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}",
    "<rootDir>/**/*.{test,spec}.{js,jsx,ts,tsx}"
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^react-native$": "<rootDir>/__tests__/__mocks__/react-native.js"
  }
};
