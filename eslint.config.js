// @ts-check
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  {
    files: [
      "src/shell/**/*.ts",
      "src/features/**/*.ts",
      "src/about-module/**/*.ts",
    ],
    ignores: ["src/mfe1/**", "node_modules/**", "dist/**"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs["recommended"].rules,
    },
  },
];
