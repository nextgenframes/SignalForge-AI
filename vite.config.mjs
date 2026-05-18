import { createRequire } from "node:module";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const require = createRequire(import.meta.url);
const loadLocalEnv = require("./load-env.cjs");
loadLocalEnv();

export default defineConfig({
  plugins: [react()],
});
