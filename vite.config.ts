import { builtinModules } from "node:module";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: [...builtinModules, ...builtinModules.map((moduleName) => `node:${moduleName}`)],
      output: {
        banner: "#!/usr/bin/env node",
      },
    },
    target: "node20",
    sourcemap: true,
    emptyOutDir: true,
  },
});
