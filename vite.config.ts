import { builtinModules } from "node:module";
import { defineConfig } from "vite";

const dependencyModules = ["commander", "fast-glob", "prompts", "ts-shared"];
const external = new Set([
  ...builtinModules.flatMap((moduleName) => {
    const normalizedName = moduleName.startsWith("node:")
      ? moduleName.slice("node:".length)
      : moduleName;

    return [normalizedName, `node:${normalizedName}`];
  }),
  ...dependencyModules,
]);

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "index.mjs",
    },
    rollupOptions: {
      external: (id) =>
        [...external].some((moduleName) => id === moduleName || id.startsWith(`${moduleName}/`)),
      output: {
        banner: "#!/usr/bin/env node",
      },
    },
    target: "node24",
    sourcemap: true,
    emptyOutDir: true,
  },
});
