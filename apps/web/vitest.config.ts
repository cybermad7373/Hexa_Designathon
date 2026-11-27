import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // Only enforce coverage on modules with unit tests. New library/server
      // modules must be paired with a test before they are added here.
      include: ["src/lib/rate-limit.ts", "src/lib/errors.ts", "src/server/auth/rbac.ts"],
      exclude: ["**/*.test.ts"],
      thresholds: {
        statements: 95,
        branches: 95,
        functions: 95,
        lines: 95,
      },
    },
  },
});
