import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Preserved original prototype — an archived artifact, not source we lint.
    "reference/**",
    // Local leftovers from the retired CMS/MCP installs are ignored by Git.
    "cms/**",
    "mcp/**",
  ]),
]);

export default eslintConfig;
