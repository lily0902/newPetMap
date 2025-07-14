# PetMap 寵物生活地圖平台

## 專案用途

PetMap 是一個結合地圖的寵物走失回報與地點收藏平台，讓用戶可以：
- 在地圖上回報、查詢寵物走失地點
- 收藏寵物友善地點（餐廳、醫院、住宿等）
- 管理個人走失回報與我的最愛
- 以圖片、描述、地理座標完整記錄走失事件

適合寵物主人、動保志工、一般民眾協尋與資訊交流。

## 特色技術

- **前端**：
  - Vue 3 + Composition API
  - Pinia 狀態管理
  - Vue Router
  - Tailwind CSS + PostCSS
  - Vite 開發伺服器
  - Google Maps JavaScript API
  - Axios 串接 API
- **後端**：
  - Node.js + Express
  - MongoDB + Mongoose ODM
  - JWT 驗證
  - Multer 圖片上傳
  - Google Places API Proxy

## 主要功能

- Google 地圖顯示所有走失地點 marker
- 走失回報表單（含圖片、座標、描述）
- 我的最愛地點收藏/取消
- 會員註冊、登入、JWT 驗證
- 走失回報/我的最愛 CRUD
- 圖片上傳與靜態服務
- Google Places API 代理，解決 CORS 問題

## 快速啟動

1. 安裝依賴
   ```bash
   # 前端
   cd frontend
   npm install
   # 後端
   cd ../backend
   npm install
   ```
2. 設定環境變數
   - frontend/.env：
     ```env
     VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
     ```
   - backend/.env：
     ```env
     MONGODB_URI=mongodb://localhost:27017/petmap
     JWT_SECRET=your_jwt_secret_key
     PORT=3000
     GOOGLE_API_KEY=your_google_maps_api_key
     ```
3. 啟動服務
   ```bash
   # 啟動後端
   cd backend
   npm start
   # 啟動前端
   cd ../frontend
   npm run dev
   ```

## 目錄結構

- [backend/README.md](./backend/README.md) — 後端 API 與資料結構說明
- [frontend/README.md](./frontend/README.md) — 前端元件與功能說明

---

如需詳細 API、元件、資料表結構，請參考各子目錄 README。
