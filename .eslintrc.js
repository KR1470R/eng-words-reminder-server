module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/array-type": [
      "error",
      {
        "default": "array-simple"
      }
    ],
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      }
    ],
    "@typescript-eslint/ban-ts-comment": [
      "off"
    ],
    "@typescript-eslint/explicit-member-accessibility": [
      "off"
    ],
    "@typescript-eslint/no-non-null-assertion": [
      "off"
    ],
    "@typescript-eslint/no-use-before-define": [
      "off"
    ],
    "@typescript-eslint/no-parameter-properties": [
      "off"
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/ban-ts-ignore": [
      "off"
    ],
    "@typescript-eslint/no-empty-function": [
      "off"
    ],
    "no-return-await": "error",
    "require-await": "error",
    "no-async-promise-executor": "error"
  },
};
