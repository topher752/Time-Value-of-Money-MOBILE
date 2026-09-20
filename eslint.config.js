// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'dist/*',
      // The legacy calculation oracle for lib/tvm.test.ts. Deliberately
      // kept byte-identical to the original (var declarations and all), so
      // linting it only produces noise. Never bundled.
      'lib/__fixtures__/*',
    ],
  },
]);
