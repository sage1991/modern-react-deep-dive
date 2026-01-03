import js from "@eslint/js"
import { defineConfig, globalIgnores } from "eslint/config"
import prettier from "eslint-plugin-prettier/recommended"
import react from "eslint-plugin-react"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import globals from "globals"
import ts from "typescript-eslint"

export default defineConfig([
  globalIgnores([".pnp.*"]),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  ts.configs.recommended,
  react.configs.flat.recommended,
  prettier,
  {
    plugins: {
      "simple-import-sort": simpleImportSort
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error"
    }
  }
])
