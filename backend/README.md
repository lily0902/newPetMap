# Backend 目錄結構與用途說明

## 目錄結構

```
backend/
├── index.js                # 主要 Express 伺服器程式，僅負責啟動、路由掛載、MongoDB 連線
├── package.json            # Node.js 專案描述與依賴套件
├── package-lock.json       # 依賴鎖定檔案，確保安裝一致性
├── public/
│   └── uploads/            # 上傳圖片儲存目錄（寵物走失照片等）
├── models/
│   ├── User.js             # User 資料表 schema 定義
│   └── MissingPetReport.js # 走失寵物回報 schema 定義
├── routes/
│   ├── auth.js             # 註冊、登入、驗證、登出 API 路由
│   ├── user.js             # 我的最愛、個人資料 API 路由
│   ├── report.js           # 走失寵物回報 CRUD API 路由
│   └── googleProxy.js      # Google Places API 代理路由
├── middleware/
│   ├── authenticateToken.js# JWT 驗證中介層
│   └── errorHandler.js     # 集中錯誤處理中介層（如有）
├── utils/
│   ├── upload.js           # multer 上傳設定
│   └── logger.js           # 日誌工具（如有）
```

## 各檔案/資料夾用途

- **index.js**
  - Express 伺服器主程式，僅負責：
    - 啟動伺服器
    - 掛載 API 路由
    - 連線 MongoDB
- **models/**
  - User.js：用戶資料 schema
  - MissingPetReport.js：走失寵物回報 schema
- **routes/**
  - auth.js：註冊、登入、驗證、登出
  - user.js：我的最愛、個人資料
  - report.js：走失寵物回報 CRUD
  - googleProxy.js：Google Places API 代理
- **middleware/**
  - authenticateToken.js：JWT 驗證中介層
  - errorHandler.js：集中錯誤處理（如有）
- **utils/**
  - upload.js：multer 上傳設定
  - logger.js：日誌工具（如有）
- **public/uploads/**
  - 儲存前端上傳的寵物走失照片，供靜態路徑存取。

## 主要功能
- JWT 驗證與用戶管理
- 走失寵物資料 CRUD
- 圖片上傳與靜態服務
- Google Places API 代理
- 我的最愛地點收藏
- 模組化路由與中介層，易於維護與擴充 