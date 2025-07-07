import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginPrettier from "eslint-plugin-prettier";
import pluginNext from "@next/eslint-plugin-next";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  js.configs.recommended,

  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: "writable",
        document: "readonly",
        window: "readonly",
        navigator: "readonly",
        console: "readonly",
        alert: "readonly",
        confirm: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        fetch: "readonly",
        localStorage: "readonly",
        require: "readonly",
        module: "readonly",
        process: "readonly",
        CustomEvent: "readonly",
        FormData: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly"
      },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      prettier: pluginPrettier,
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
      curly: ['error', 'all'],
      "react/prop-types": "off",
      "prettier/prettier": [
        "error",
        {
          semi: true,
          singleQuote: true,
          trailingComma: "all",
          printWidth: 100,
          tabWidth: 2,
          arrowParens: "avoid",
          endOfLine: "auto",
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  {
    files: ["pages/api/**/*.js", "lib/**/*.js", "next.config.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
        URLSearchParams: "readonly",
        alert: "readonly",
        confirm: "readonly",
        setTimeout: "readonly",

      },
    },
  },
];
