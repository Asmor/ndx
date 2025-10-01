import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node", // default
    environmentMatchGlobs: [
      ["**/*.test.tsx", "happy-dom"], // JSX/DOM tests
    ],
  },
});
