# Backend 目錄結構與用途說明

## 目錄結構

```
backend/
├── index.js              # 主要 Express 伺服器程式，API 路由、MongoDB 連線、Schema 定義
├── package.json          # Node.js 專案描述與依賴套件
├── package-lock.json     # 依賴鎖定檔案，確保安裝一致性
├── public/
│   └── uploads/          # 上傳圖片儲存目錄（寵物走失照片等）

```

## 各檔案/資料夾用途

- **index.js**
  - Express 伺服器主程式，包含：
    - 用戶註冊/登入/驗證 API
    - 走失寵物回報 CRUD API
    - 我的最愛地點收藏 API
    - Google Places API Proxy
    - 上傳圖片處理（multer）
    - MongoDB 連線與 Schema 定義
- **package.json / package-lock.json**
  - 專案依賴管理與版本鎖定。
- **public/uploads/**
  - 儲存前端上傳的寵物走失照片，供靜態路徑存取。


## 主要功能
- JWT 驗證與用戶管理
- 走失寵物資料 CRUD
- 圖片上傳與靜態服務
- Google Places API 代理
- 我的最愛地點收藏 