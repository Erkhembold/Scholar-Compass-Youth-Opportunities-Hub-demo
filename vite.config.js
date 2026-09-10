import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vercel serves this app from the domain root, so `base` stays "/".
// (If you ever move to GitHub Pages as a project page instead — i.e.
// https://<user>.github.io/<repo>/ — change this back to "/<repo>/".)
export default defineConfig({
  plugins: [react()],
  base: "/",
});
