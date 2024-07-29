import react from "file:///E:/2023-2024-Autumn/FULLSTACK/fullstack-project/part5/blog-frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///E:/2023-2024-Autumn/FULLSTACK/fullstack-project/part5/blog-frontend/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3003",
        changeOrigin: true
      }
    }
  }
});
export {
  vite_config_default as default
};
