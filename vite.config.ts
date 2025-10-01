/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// @ts-ignore
const __dirname = path.dirname(new URL("", import.meta.url).pathname);

export default defineConfig({
  plugins: [react()],
  base: "/ndx/",
});
