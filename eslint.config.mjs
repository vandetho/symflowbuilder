import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    eslintConfigPrettier,
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
    {
        plugins: {
            "unused-imports": unusedImports,
        },
        rules: {
            // Unused imports & vars
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "warn",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],

            // TypeScript
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": "off", // handled by unused-imports
            "@typescript-eslint/consistent-type-imports": [
                "error",
                { prefer: "type-imports" },
            ],

            // React
            "react/self-closing-comp": "error",
            "react/jsx-curly-brace-presence": [
                "error",
                { props: "never", children: "never" },
            ],

            // General
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "prefer-const": "error",
            eqeqeq: ["error", "always"],
        },
    },
]);

export default eslintConfig;
