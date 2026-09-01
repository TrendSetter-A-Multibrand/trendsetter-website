import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

/**
 * Tests sit next to what they test, as ARCHITECTURE.md asks, so the pattern
 * follows the source tree rather than a folder of its own. `tsconfigPaths` is
 * what makes `@/` mean the same here as it does in the app.
 *
 * CAREFUL: while the project lives at a path with a space in it - «Web
 * TRENDSETTER» - Vite cannot resolve anything out of node_modules: it builds the
 * path as a URL, and %20 breaks the lookup. Tests that only reach for our own
 * files work, because `@/` resolves to a real path; anything importing a package
 * fails at transform with "Does the file exist?".
 *
 * That is why there are no component tests yet: they need @testing-library/react.
 * Both testing-library packages are installed and the plugin below is here for
 * them - move the repository somewhere without a space and they run as they are.
 */
export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
