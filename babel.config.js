module.exports = {
  presets: [
    [
      '@react-native/babel-preset',
      {
        flow: {
          all: true,
        },
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-flow-strip-types',
    ['@babel/plugin-syntax-flow', { all: true }],
    ["module:react-native-dotenv", {
      "moduleName": "@env",
      "path": ".env",
      "blacklist": null,
      "whitelist": null,
      "safe": false,
      "allowUndefined": true
    }]
  ],
};
