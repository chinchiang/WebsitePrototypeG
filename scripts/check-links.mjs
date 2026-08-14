#!/usr/bin/env node
/**
 * 架構先行、內容後補
 * 檢查 dist 內站內連結是否斷裂（相對路徑 / base-aware）。
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");

if (!fs.existsSync(DIST)) {
  console.error("dist/ not found. Run `npm run build` first.");
  process.exit(1);
}

function normalizeBase(raw) {
  if (!raw || raw === "/") return "";
  const withLead = raw.startsWith("/") ? raw : `/${raw}`;
  return withLead.replace(/\/+$/, "");
}

const basePrefix = normalizeBase(process.env.BASE_PATH ?? process.env.PUBLIC_BASE_PATH ?? "/");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".html") ? [full] : [];
  });
}

function stripBase(urlPath) {
  if (!basePrefix) return urlPath;
  if (urlPath === basePrefix || urlPath === `${basePrefix}/`) return "/";
  if (urlPath.startsWith(`${basePrefix}/`)) return urlPath.slice(basePrefix.length);
  return urlPath;
}

function existsOnDisk(urlPath) {
  const clean = stripBase(urlPath.split("#")[0].split("?")[0]);
  if (!clean || clean === "/") {
    return fs.existsSync(path.join(DIST, "index.html"));
  }
  const trimmed = clean.replace(/^\/+/, "").replace(/\/+$/, "");
  const candidates = [
    path.join(DIST, trimmed),
    path.join(DIST, trimmed, "index.html"),
    path.join(DIST, `${trimmed}.html`),
  ];
  return candidates.some((candidate) => fs.existsSync(candidate));
}

const htmlFiles = walk(DIST);
const hrefRe = /(?:href|src)="([^"]+)"/g;
const skip = /^(https?:|mailto:|tel:|data:|javascript:|#)/i;
const errors = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(DIST, file);
  let match;
  while ((match = hrefRe.exec(html))) {
    const raw = match[1];
    if (skip.test(raw)) continue;
    if (raw.includes("pagefind-ui.")) continue;
    const urlPath = raw.startsWith("/") ? raw : `/${raw}`;
    if (!existsOnDisk(urlPath)) {
      errors.push(`${rel} -> ${raw}`);
    }
  }
}

if (errors.length) {
  console.error(`Link check failed (${errors.length}):\n`);
  for (const err of errors) console.error(` - ${err}`);
  process.exit(1);
}

console.log(`Link check passed (${htmlFiles.length} html files).`);
