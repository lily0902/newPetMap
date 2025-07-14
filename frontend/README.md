# Frontend 目錄結構與用途說明

## 目錄結構

```
frontend/
├── index.html                # SPA 入口 HTML
├── package.json              # 前端專案依賴描述
├── package-lock.json         # 依賴鎖定檔案
├── postcss.config.js         # PostCSS 設定（含 Tailwind）
├── tailwind.config.js        # Tailwind CSS 設定
├── vite.config.js            # Vite 開發伺服器與代理設定
├── public/
│   └── assets/               # 靜態資源（icon、圖片等）
├── src/
│   ├── App.vue               # Vue 應用主組件
│   ├── main.js               # 入口 JS，掛載 Vue app
│   ├── style.css             # 全域樣式（含 Tailwind）
│   ├── assets/               # 前端專用圖片/icon
│   ├── components/           # Vue 元件（頁面、功能模組）
│   │   ├── Home.vue              # 地圖主頁，地標/走失/篩選/表單
│   │   ├── infoPanel.vue         # 側邊資訊面板，地點/走失/我的最愛切換
│   │   ├── locationInfo.vue      # 顯示地點詳細資訊
│   │   ├── profile.vue           # 會員資訊與我的最愛、走失回報
│   │   ├── lostPet.vue           # 走失地點地圖與資訊（marker）
│   │   ├── LostPetInfo.vue       # 顯示單筆走失資訊卡片
│   │   ├── login.vue / signUp.vue / forgotPassword.vue # 登入/註冊/忘記密碼
│   ├── composables/          # Vue 3 Composition API hooks（地理定位、地點查詢）
│   ├── stores/               # Pinia 狀態管理（auth、map、location）
│   ├── router/               # Vue Router 設定
├── GoogleMap-Vue-Debug-Log.md # 開發與除錯紀錄
├── Vue-Watch-Error-Solution.md # Vue watch 錯誤解法紀錄
```

## 各檔案/資料夾用途

- **index.html**
  - 前端 SPA 入口點。
- **src/components/**
  - 各頁面與功能元件：
    - Home.vue：地圖主頁，地標/走失/篩選/表單
    - infoPanel.vue：側邊資訊面板，地點/走失/我的最愛切換
    - locationInfo.vue：地點詳細資訊
    - profile.vue：會員資訊、我的最愛、走失回報
    - lostPet.vue：走失地點地圖與 marker
    - LostPetInfo.vue：單筆走失資訊卡片
    - login.vue / signUp.vue / forgotPassword.vue：登入/註冊/忘記密碼
- **src/composables/**
  - Vue 3 hooks，封裝地理定位、地點查詢等功能。
- **src/stores/**
  - Pinia 狀態管理（auth、map、location）。
- **src/router/**
  - Vue Router 設定。
- **public/assets/**
  - icon、圖片等靜態資源。
- **GoogleMap-Vue-Debug-Log.md**
  - 開發與除錯紀錄。

## 主要功能
- Google Maps API 地圖與地標
- 走失地點 marker 顯示
- 地點/走失/我的最愛資訊切換
- 會員登入/註冊/驗證
- 走失回報表單與圖片上傳
- 我的最愛收藏
