import swc from "unplugin-swc";
import { configDefaults, defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true,
    root: "./",
    exclude: [...configDefaults.exclude, "/dist"],
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: "es6" },
    }),
  ],
});
