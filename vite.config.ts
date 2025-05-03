import { defineConfig } from "vite";
import swc from "unplugin-swc";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // swc.vite({
    //   jsc: {
    //     parser: {
    //       syntax: "typescript",
    //       decorators: true,
    //     },
    //     transform: {
    //       react: {
    //         runtime: "automatic",
    //       },
    //     },
    //   },
    // }),
  ],
});
