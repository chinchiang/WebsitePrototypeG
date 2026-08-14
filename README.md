# 製造業集團 IT 資安入口（骨架）

架構先行、內容後補。本儲存庫只提供網站結構、導航、版面與佔位符，**不含**真實或虛構的政策全文、訓練教材、公告或 SOP 文字。

服務對象結構：一般員工、廠區操作員、工程師、管理層、供應商。  
角色切換為 UI 預留，不連接真實帳號。

## 頁面結構

| 路徑 | 用途 |
| --- | --- |
| `/` | 首頁 / Dashboard（警報橫幅、快速行動、狀態摘要、角色推薦） |
| `/policies/` | 政策文件庫（分類樹 + 列表 + 詳情） |
| `/training/` | 意識與訓練中心（分類 + 課程卡片 + 進度條佔位） |
| `/incident/` | 事件通報（類型選擇 + 表單 + SOP 流程圖佔位） |
| `/resources/` | 資源與工具中心 |
| `/me/` | 個人儀表板（登入後結構） |
| `/contact/` | 聯絡與組織 |
| `/search/` | Pagefind 搜尋容器 |

## 原則

- 內容區一律標示 `PLACEHOLDER`
- 負責人寫 `owner: TBD`
- 主機 / 信箱只允許 `example.internal`
- **不得**提交實際政策文件、內部主機名稱、IP、人員姓名或分機

內容治理欄位（frontmatter 必填）：`title` `version` `effectiveDate` `nextReviewDate` `scope` `owner` `category`

## 本機預覽

```bash
git clone https://github.com/chinchiang/WebsitePrototypeG.git
cd WebsitePrototypeG
cp .env.example .env
npm ci
npm run dev
```

開發伺服器預設聽在 `0.0.0.0:8080`。內網預設 `BASE_PATH=/`。

本機完整檢查（與 CI 相同）：

```bash
npm run validate:frontmatter
npm run build
npm run pagefind
npm run check:links
```

## 環境變數（site / base）

| 環境 | `SITE_URL` | `BASE_PATH` |
| --- | --- | --- |
| 內網根目錄 | `https://example.internal`（部署時改為內網入口網址） | `/` |
| GitHub Pages 預覽 | `https://chinchiang.github.io` | `/WebsitePrototypeG/` |

所有內部連結必須使用 `withBase()`，禁止寫死 `/policies` 這類絕對路徑。

## 從 GitHub 建置後同步到內網

1. 在 GitHub 確認 `main` 的 CI 通過（frontmatter、build、Pagefind、連結檢查）。
2. 於內網建置機或 CI runner：

```bash
git clone https://github.com/chinchiang/WebsitePrototypeG.git
cd WebsitePrototypeG
npm ci
SITE_URL=https://example.internal BASE_PATH=/ npm run build
npm run pagefind
```

3. 將 `dist/` 同步到內網網頁根目錄（範例，主機名請在部署手冊另填，勿寫入本 repo）：

```bash
rsync -av --delete dist/ user@example.internal:/var/www/security-portal/
```

4. 內網伺服器以靜態網站提供 `dist/`，根路徑對應 `BASE_PATH=/`。

GitHub Pages 預覽由 `.github/workflows/pages.yml` 以 `BASE_PATH=/WebsitePrototypeG/` 建置。需在 repo Settings → Pages 選擇 GitHub Actions 作為來源。

## CI

`.github/workflows/ci.yml` 於 `push` 與 `pull_request` 執行：

1. `npm ci`
2. `npm run validate:frontmatter`（失敗即 CI 失敗）
3. `npm run build`
4. `npm run pagefind`
5. `npm run check:links`

內容 PR 請使用 `.github/pull_request_template.md` 檢查清單。區塊負責人見 `.github/CODEOWNERS`（目前為 `@TBD-*` 佔位帳號）。
