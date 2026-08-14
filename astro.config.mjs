// 架構先行、內容後補
// site / base 一律由環境變數驅動，禁止寫死絕對路徑。
// 內網：BASE_PATH=/
// GitHub Pages：BASE_PATH=/WebsitePrototypeG/

import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

function normalizeBase(raw) {
  if (!raw || raw === "/") return "/";
  const withLead = raw.startsWith("/") ? raw : `/${raw}`;
  return withLead.endsWith("/") ? withLead : `${withLead}/`;
}

const site = process.env.SITE_URL ?? process.env.PUBLIC_SITE_URL ?? "https://example.internal";
const base = normalizeBase(process.env.BASE_PATH ?? process.env.PUBLIC_BASE_PATH ?? "/");

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  output: "static",
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      host: "0.0.0.0",
      port: 8080,
      strictPort: true,
    },
  },
});
