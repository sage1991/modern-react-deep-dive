import { defineConfig } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

import root from "../../eslint.config.mjs"

export default defineConfig([...root, ...nextVitals, ...nextTs])
