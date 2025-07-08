# Vue 3 + Vite

本專案為 Vue 3 + Vite 建構的前端專案，結合 Google Maps API，並以 Pinia 管理狀態。

## 專案結構說明

```
frontend/
├── index.html                # 專案入口 HTML，掛載 Vue app
├── package.json              # 專案依賴與腳本
├── vite.config.js            # Vite 設定檔
├── README.md                 # 專案說明文件
├── public/
│   └── assets/
│       └── icons/            # 各類地標圖示（醫院、餐廳、住宿等）
│       └── vue.svg           # Vue 標誌
├── src/
│   ├── App.vue               # 主組件，地圖與搜尋、篩選 UI
│   ├── main.js               # 入口 JS，掛載 Vue app
│   ├── style.css             # 全域樣式（含 Tailwind）
│   ├── assets/
│   │   └── icons/            # 前端用的地標圖示
│   ├── components/
│   │   └── infoPanel.vue     # 地點詳細資訊面板元件
│   ├── composables/
│   │   └── useGeolocation.js # 取得與追蹤使用者定位的組合式函式
│   │   └── usePlacesLoader.js# Google Maps 地點查詢與標記管理
│   ├── stores/
│   │   └── locationStore.js  # Pinia 狀態：管理使用者定位
│   │   └── mapStore.js       # Pinia 狀態：管理地圖實例與相關狀態
```

## 主要目錄與檔案用途

- `index.html`：專案入口 HTML，載入 Tailwind 與 Vue app。
- `public/assets/icons/`：存放地圖標記用的 PNG 圖示。
- `src/App.vue`：主畫面，包含地圖、搜尋欄、篩選器、資訊面板等。
- `src/components/infoPanel.vue`：顯示地點詳細資訊的側邊面板。
- `src/composables/useGeolocation.js`：取得並監聽使用者地理位置。
- `src/composables/usePlacesLoader.js`：Google Maps API 地點查詢、標記建立與管理。
- `src/stores/locationStore.js`：Pinia 狀態，儲存與設定使用者定位。
- `src/stores/mapStore.js`：Pinia 狀態，儲存地圖實例與相關操作。
- `src/style.css`：全域樣式，含 Tailwind 設定。

## 開發建議
- 進入 `src/` 目錄，從 `App.vue` 開始閱讀主流程。
- 若需擴充地標類型，請參考 `usePlacesLoader.js` 與 `App.vue` 內的 `ALL_TYPES` 設定。
- 若需調整地圖行為，請參考 `mapStore.js` 與 `useGeolocation.js`。

---

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
