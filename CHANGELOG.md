# Changelog

本專案遵循「架構先行、內容後補」。此檔只記錄骨架與治理變更，不記錄虛構政策內容。

## 0.1.1 — 2026-08-15

### Fixed

- 站內連結檢查可推斷 GitHub Pages 子路徑，避免 `BASE_PATH=/WebsitePrototypeG/` 被誤判為斷鏈

## 0.1.0 — 2026-08-15

### Added

- 七個主要頁面骨架：首頁、政策文件庫、意識與訓練、事件通報、資源與工具、個人儀表板、聯絡與組織
- 固定頂部導航、角色切換 UI（無真實授權邏輯）、佔位符元件
- Astro content collections 與治理 frontmatter（version / dates / scope / owner）
- `site` / `base` 改由環境變數驅動，支援內網根目錄與 GitHub Pages 子路徑
- Frontmatter 稽核腳本、站內連結檢查、Pagefind 索引步驟
- CI、GitHub Pages 預覽 workflow、CODEOWNERS、PR 範本
