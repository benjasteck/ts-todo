import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true, // binds to 0.0.0.0
    port: 5173
  },
  base: '/todo/'
})
