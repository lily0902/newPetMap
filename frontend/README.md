# PetMap 登入系統

這是一個完整的用戶認證系統，包含註冊、登入、登出和路由保護功能。

## 功能特色

### 🔐 認證功能
- **用戶註冊**: 支援用戶名、Email 和密碼註冊
- **用戶登入**: 使用 Email 和密碼登入
- **JWT Token**: 使用 JWT 進行身份驗證
- **自動登入**: 記住登入狀態，重新整理頁面不會登出
- **登出功能**: 清除所有認證資料

### 🛡️ 安全功能
- **密碼加密**: 使用 bcrypt 加密密碼
- **Token 驗證**: 每次請求都會驗證 JWT token
- **路由保護**: 未登入用戶無法訪問受保護的頁面
- **輸入驗證**: 前端和後端都有完整的輸入驗證

### 🎨 用戶體驗
- **載入狀態**: 所有操作都有載入指示器
- **錯誤處理**: 友善的錯誤訊息顯示
- **響應式設計**: 支援桌面和手機瀏覽
- **無障礙設計**: 支援鍵盤導航和螢幕閱讀器

## 快速開始

### 1. 安裝依賴

```bash
# 前端
cd frontend
npm install

# 後端
cd backend
npm install
```

### 2. 環境設定

#### 前端環境變數
創建 `frontend/.env` 文件：
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

#### 後端環境變數
創建 `backend/.env` 文件：
```env
MONGODB_URI=mongodb://localhost:27017/petmap
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### 3. 啟動服務

```bash
# 啟動後端 (在 backend 目錄)
npm start

# 啟動前端 (在 frontend 目錄)
npm run dev
```

## 使用流程

### 1. 註冊新用戶
1. 訪問 `/signUp` 頁面
2. 填寫用戶名、Email 和密碼
3. 點擊 "Sign up" 按鈕
4. 註冊成功後會自動跳轉到登入頁面

### 2. 用戶登入
1. 訪問 `/login` 頁面
2. 輸入 Email 和密碼
3. 點擊 "Sign in" 按鈕
4. 登入成功後會跳轉到首頁

### 3. 使用應用
- 登入後可以訪問所有功能
- 右上角會顯示用戶資訊
- 點擊 "登出" 按鈕可以登出

### 4. 忘記密碼
1. 在登入頁面點擊 "Forgot Password?"
2. 輸入 Email 地址
3. 點擊 "Send Reset Link" 按鈕

## API 端點

### 認證相關
- `POST /api/register` - 用戶註冊
- `POST /api/login` - 用戶登入
- `GET /api/verify` - 驗證 token
- `GET /api/profile` - 獲取用戶資料

### 請求格式

#### 註冊
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123"
}
```

#### 登入
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

## 檔案結構

```
frontend/
├── src/
│   ├── components/
│   │   ├── login.vue          # 登入頁面
│   │   ├── signUp.vue         # 註冊頁面
│   │   ├── forgotPassword.vue # 忘記密碼頁面
│   │   └── Home.vue           # 首頁（需要登入）
│   ├── stores/
│   │   └── authStore.js       # 認證狀態管理
│   └── router/
│       └── index.js           # 路由配置和守衛
└── ...

backend/
├── index.js                   # 後端主程式
├── package.json
└── ...
```

## 技術棧

### 前端
- **Vue 3** - 前端框架
- **Pinia** - 狀態管理
- **Vue Router** - 路由管理
- **Axios** - HTTP 客戶端
- **Tailwind CSS** - 樣式框架

### 後端
- **Node.js** - 後端運行環境
- **Express** - Web 框架
- **MongoDB** - 資料庫
- **Mongoose** - ODM
- **JWT** - 身份驗證
- **bcrypt** - 密碼加密

## 安全注意事項

1. **JWT Secret**: 請使用強密碼作為 JWT_SECRET
2. **HTTPS**: 生產環境請使用 HTTPS
3. **環境變數**: 不要將敏感資訊提交到版本控制
4. **資料庫**: 定期備份資料庫
5. **密碼政策**: 建議實施密碼強度要求

## 故障排除

### 常見問題

1. **MongoDB 連線失敗**
   - 確認 MongoDB 服務正在運行
   - 檢查 MONGODB_URI 設定

2. **JWT Token 無效**
   - 確認 JWT_SECRET 設定正確
   - 檢查 token 是否過期

3. **CORS 錯誤**
   - 確認後端 CORS 設定正確
   - 檢查前端 API 端點設定

4. **路由無法訪問**
   - 確認路由守衛設定正確
   - 檢查用戶認證狀態

## 開發指南

### 添加新功能
1. 在 `authStore.js` 中添加新的方法
2. 在對應的組件中使用
3. 在後端添加相應的 API 端點

### 自定義樣式
- 所有樣式都使用 Tailwind CSS
- 可以在組件的 `<style>` 區塊中添加自定義樣式

### 擴展認證功能
- 可以添加社交登入（Google、Facebook 等）
- 可以添加雙因素認證
- 可以添加郵件驗證

## 授權

MIT License
