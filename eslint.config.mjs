import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

const sharedFiles = ["**/*.{js,mjs,cjs,ts,tsx}"];

export default [
  {
    ignores: [
      ".next/**",
      "build/**",
      "dist/**",
      "node_modules/**",
      "out/**",
      "public/**",
      "src/types/supabase.ts",
      "supabase/functions/**",
      "supabase/.branches/**",
      "supabase/.temp/**",
      "repository_tree_full.*",
      "*.lnk",
      "dump.sql",
      "tsconfig.tsbuildinfo",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: sharedFiles,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": "off",
      "no-new-func": "off",
    },
  },
];
