import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

/**
 * Tests sit next to what they test, as ARCHITECTURE.md asks, so the pattern
 * follows the source tree rather than a folder of its own. `tsconfigPaths` is
 * what makes `@/` mean the same here as it does in the app.
 *
 * CAREFUL: the repository must not live at a path with a space in it. Vite builds
 * the path as a URL, and %20 breaks the walk up to node_modules - every import of
 * a package then fails at transform with "Does the file exist?", while our own
 * files still resolve because `@/` gives a real path. That is what «Web
 * TRENDSETTER» did, and why this now sits at C:\Work	rendsetter.
 *
 * No jest-dom either: its matchers are sugar over assertions the runner already
 * has, and one package fewer is one package fewer.
 */
export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
