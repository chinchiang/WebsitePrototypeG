/**
 * 架構先行、內容後補
 * 所有內部連結必須走 withBase()，避免 GitHub Pages 子路徑 404。
 */
export function withBase(path = ""): string {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const clean = String(path).replace(/^\/+/, "");
  return `${normalizedBase}${clean}`;
}

export const routes = {
  home: "",
  policies: "policies/",
  training: "training/",
  incident: "incident/",
  resources: "resources/",
  me: "me/",
  contact: "contact/",
  search: "search/",
} as const;
