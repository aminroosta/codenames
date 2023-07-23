import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solid({ ssr: false })],
  ssr: {
    external: ["ws", "uuid", "bip39", "better-sqlite3"],
  }
});
