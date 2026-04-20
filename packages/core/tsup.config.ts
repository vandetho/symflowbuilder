import { defineConfig } from "tsup";

export default defineConfig({
    entry: {
        index: "src/index.ts",
        engine: "src/engine/index.ts",
        subject: "src/subject/index.ts",
        yaml: "src/yaml/index.ts",
        json: "src/json/index.ts",
        typescript: "src/typescript/index.ts",
        types: "src/types/index.ts",
        "react-flow": "src/adapters/react-flow/index.ts",
    },
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    sourcemap: true,
    treeshake: true,
    splitting: false,
    outExtension: ({ format }) => ({
        js: format === "cjs" ? ".cjs" : ".js",
    }),
});
