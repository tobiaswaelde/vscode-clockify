const parser = require("@typescript-eslint/parser");
const typescript = require("@typescript-eslint/eslint-plugin");

module.exports = [
  {
    ignores: ["out/**", "dist/**", "**/*.d.ts"],
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
    },
    rules: {
      "@typescript-eslint/naming-convention": "warn",
      curly: "warn",
      eqeqeq: "warn",
      "no-throw-literal": "warn",
      semi: "warn",
    },
  },
];
