import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import manifest from "./manifest.json";

import * as fs from "fs/promises";

const organizeLicensesJson = (command) => ({
  name: "organize-licenses",
  async buildStart() {
    if (command !== "build") return;
    const jsonPath = "./public/licenses.json";
    const jsonStr = await fs.readFile(jsonPath, {
      encoding: "utf-8",
    });
    const licenses = JSON.parse(jsonStr);
    const newLicenses = Object.keys(licenses).reduce((acc, cur) => {
      const newArray = licenses[cur].map((p) => {
        delete p.paths;
        return p;
      });
      acc[cur] = newArray;
      return acc;
    }, {});
    const newJsonStr = JSON.stringify(newLicenses, null, " ");

    fs.writeFile(jsonPath, newJsonStr);
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  plugins: [organizeLicensesJson(command), react(), crx({ manifest })],
}));
