# 🐞 昆蟲大解密 ｜ Insect Explorer

一份適合**國小中年級（3–4 年級）**的自然科學互動式數位教材。帶著小朋友一起化身昆蟲小偵探，認識昆蟲的身體、棲息地、成長變化，以及昆蟲對大自然的重要性。

> 本教材以純 HTML5 / CSS3 / SVG / 原生 JavaScript 製作，採**多頁式網站**（每個單元一個 HTML 檔），不依賴大型框架，可直接部署於 GitHub Pages。

---

## 📖 教材簡介

| 項目 | 內容 |
|---|---|
| 教材名稱 | 昆蟲大解密 |
| 適用對象 | 國小中年級（3–4 年級） |
| 科目領域 | 自然科學 |
| 學習時間 | 約 40 分鐘 |
| 語言 | 繁體中文（台灣） |

## 🎯 學習目標

1. 認識昆蟲的身體：頭、胸、腹三部分，以及 6 隻腳。
2. 學會分辨哪些小動物是昆蟲、哪些不是。
3. 知道昆蟲生活在哪些地方，學會觀察昆蟲。
4. 了解昆蟲的成長變化：完全變態與不完全變態。
5. 體會昆蟲對大自然與人類的重要（授粉、分解、食物鏈）。

## ✨ 教材特色

- 🗂️ **頁籤式單元**：7 個單元清楚分段，手機可橫向滑動。
- 🎮 **互動學習**：找昆蟲遊戲、拖曳分類，即時回饋。
- 🎬 **教學寫實 SVG 動畫**：完全／不完全變態對照，可播放、暫停、單步、重設。
- 🐝 **授粉模擬**：點花朵讓蜜蜂授粉、結果，理解昆蟲的貢獻。
- 🏆 **闖關大挑戰**：10 題素養導向題目，含解析與回看單元。
- 📚 **自主學習**：8 個可信賴的台灣教育與博物館資源。
- 📱 **跨裝置**：支援電腦、平板、手機，並支援降低動態與鍵盤操作。
- 💾 **學習進度**：自動記錄造訪單元（localStorage）。

## 🗂️ 頁籤內容

1. 學習任務 — 學習目標與引導
2. 昆蟲在哪裡 — 身體構造、棲地、辨認昆蟲
3. 昆蟲如何長大 — 完全／不完全變態、脫皮
4. 昆蟲重要嗎 — 授粉、分解、食物鏈、利與害
5. 生活應用 — 7 則生活情境與思考問題
6. 闖關大挑戰 — 10 題互動測驗
7. 自主學習 — 延伸學習資源

## 🚀 使用方式

直接以瀏覽器開啟線上版（GitHub Pages）即可使用，無需安裝。

### 本機啟動（開發用）

因教材會載入 JSON 資料，請使用本機伺服器開啟（直接雙擊 `index.html` 可能無法載入資料）：

```bash
npm install
npm run dev
```

或使用任一靜態伺服器，例如：

```bash
npx serve .
```

## 📁 專案結構

```
insect/
├─ index.html          # 學習任務（首頁）
├─ where.html          # 昆蟲在哪裡
├─ grow.html           # 昆蟲如何長大
├─ important.html      # 昆蟲重要嗎
├─ apply.html          # 生活應用
├─ quiz.html           # 闖關大挑戰
├─ resources.html      # 自主學習
├─ css/                # style / animation / responsive
├─ js/                 # chrome（共用版面）/ app / interactions / quiz / progress
├─ data/               # content / quiz / resources / curriculum (JSON)
├─ docs/               # 教案、設計規格、參考資料、測試報告
├─ assets/             # 圖片與圖示
├─ project.config.json
├─ package.json
├─ vite.config.js
├─ README.md / CHANGELOG.md / LICENSE
```

## 🛠️ 使用技術

- HTML5、CSS3（含 RWD 與 prefers-reduced-motion）
- SVG 向量動畫
- 原生 JavaScript（無框架）
- JSON 資料與內容分離
- Vite（本機開發伺服器）

## 📚 課綱對應

依十二年國教自然科學領域第二學習階段精神設計，對應昆蟲身體構造、成長變化（變態）與生物和環境的關係。詳細對應見 [`data/curriculum.json`](data/curriculum.json) 與 [`docs/lesson-plan.md`](docs/lesson-plan.md)。

> 課綱代碼為對應建議，實際代碼請教師依正式課綱手冊確認。

## 🌐 GitHub Pages 網址

部署後更新：`https://prayer168.github.io/insect-explorer-interactive-learning/`

## 📝 開發與更新紀錄

見 [CHANGELOG.md](CHANGELOG.md)。

## 📄 授權與引用

本教材以 [CC BY 4.0](LICENSE) 授權，歡迎教師教學使用與改作，改作分享時請註明來源。
