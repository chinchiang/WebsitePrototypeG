#!/usr/bin/env node
/**
 * 架構先行、內容後補
 * Frontmatter 稽核：缺欄位或含真實內網痕跡即失敗（CI gate）。
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "src", "content");
const REQUIRED = [
  "title",
  "version",
  "effectiveDate",
  "nextReviewDate",
  "scope",
  "owner",
  "category",
];

const DATE_OK = /^(TBD|\d{4}-\d{2}-\d{2})$/;
const VERSION_OK = /^(0\.0\.0|\d+\.\d+\.\d+)$/;
const OWNER_OK = /^(TBD|TBD-[A-Za-z0-9_-]+)$/;
const IPV4 = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;
const INTERNAL_HOST = /\b(?:[a-z0-9-]+\.)+(?:local|lan|corp|internal)\b/i;
const ALLOWED_HOST = /example\.internal/i;
const EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE = /\b(?:ext\.?\s*)?\d{2,4}[-\s]?\d{3,4}[-\s]?\d{3,4}\b/i;

const errors = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".md") ? [full] : [];
  });
}

function parseFrontmatter(raw, file) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    errors.push(`${file}: missing YAML frontmatter`);
    return null;
  }
  const data = {};
  let currentKey = null;
  for (const line of match[1].split(/\r?\n/)) {
    if (/^\s*-\s+/.test(line) && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(line.replace(/^\s*-\s+/, "").trim());
      continue;
    }
    const kv = line.match(/^([A-Za-z][A-Za-z0-9_]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    currentKey = kv[1];
    data[currentKey] = kv[2] === "" ? [] : kv[2].replace(/^["']|["']$/g, "");
  }
  return data;
}

function scanSecrets(text, file) {
  if (IPV4.test(text)) errors.push(`${file}: contains IPv4 address`);
  const hosts = text.match(new RegExp(INTERNAL_HOST, "gi")) ?? [];
  for (const host of hosts) {
    if (!ALLOWED_HOST.test(host)) {
      errors.push(`${file}: internal hostname not allowed (${host})`);
    }
  }
  const emails = text.match(new RegExp(EMAIL, "gi")) ?? [];
  for (const email of emails) {
    if (!ALLOWED_HOST.test(email)) {
      errors.push(`${file}: email domain must be example.internal (${email})`);
    }
  }
  if (PHONE.test(text)) errors.push(`${file}: possible phone / extension`);
}

function validateFile(file) {
  const raw = fs.readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file);
  const data = parseFrontmatter(raw, rel);
  if (!data) return;

  for (const key of REQUIRED) {
    const value = data[key];
    const empty = value == null || value === "" || (Array.isArray(value) && value.length === 0);
    if (empty) errors.push(`${rel}: missing required field "${key}"`);
  }

  if (data.version && !VERSION_OK.test(String(data.version))) {
    errors.push(`${rel}: version must be semver (got ${data.version})`);
  }
  if (data.effectiveDate && !DATE_OK.test(String(data.effectiveDate))) {
    errors.push(`${rel}: effectiveDate must be TBD or YYYY-MM-DD`);
  }
  if (data.nextReviewDate && !DATE_OK.test(String(data.nextReviewDate))) {
    errors.push(`${rel}: nextReviewDate must be TBD or YYYY-MM-DD`);
  }
  if (data.owner && !OWNER_OK.test(String(data.owner))) {
    errors.push(`${rel}: owner must be TBD or TBD-* (got ${data.owner})`);
  }

  scanSecrets(raw, rel);
}

const files = walk(CONTENT_DIR);
if (files.length === 0) {
  errors.push("no content markdown files found under src/content");
}
files.forEach(validateFile);

if (errors.length) {
  console.error("Frontmatter validation failed:\n");
  for (const err of errors) console.error(` - ${err}`);
  process.exit(1);
}

console.log(`Frontmatter validation passed (${files.length} files).`);
