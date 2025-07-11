# 登入流程測試指南

## 前置條件

1. 確保 MongoDB 正在運行
2. 確保後端服務正在運行 (`npm start` 或 `npm run dev`)
3. 確保前端服務正在運行 (`npm run dev`)

## 測試步驟

### 1. 測試註冊功能

1. 訪問 `http://localhost:5173/signUp`
2. 填寫以下資訊：
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. 點擊 "Sign up" 按鈕
4. 應該看到 "註冊成功！" 訊息
5. 3 秒後自動跳轉到登入頁面

### 2. 測試登入功能

1. 在登入頁面輸入：
   - Email: `test@example.com`
   - Password: `password123`
2. 點擊 "Sign in" 按鈕
3. 應該成功登入並跳轉到首頁
4. 右上角應該顯示用戶資訊（頭像縮寫 "TE"）

### 3. 測試路由保護

1. 在登入狀態下，嘗試訪問 `/login` 或 `/signUp`
2. 應該自動重定向到首頁
3. 登出後，嘗試訪問首頁 `/`
4. 應該自動重定向到登入頁面

### 4. 測試登出功能

1. 在首頁右上角點擊 "登出" 按鈕
2. 應該清除用戶資訊並跳轉到登入頁面
3. 嘗試訪問首頁，應該被重定向到登入頁面

### 5. 測試錯誤處理

#### 註冊錯誤測試：
1. 嘗試註冊相同的 Email
2. 應該顯示 "Email already registered." 錯誤
3. 嘗試註冊相同的 Username
4. 應該顯示 "Username already taken." 錯誤
5. 嘗試不填寫必填欄位
6. 應該顯示相應的錯誤訊息

#### 登入錯誤測試：
1. 使用錯誤的 Email 或密碼
2. 應該顯示 "Invalid email or password." 錯誤
3. 嘗試不填寫必填欄位
4. 應該顯示相應的錯誤訊息

### 6. 測試 Token 持久化

1. 登入成功後，重新整理頁面
2. 應該保持登入狀態，不會被登出
3. 檢查瀏覽器的 localStorage，應該有 token 和 user 資料

### 7. 測試忘記密碼功能

1. 在登入頁面點擊 "Forgot Password?"
2. 輸入 Email 地址
3. 點擊 "Send Reset Link" 按鈕
4. 應該顯示 "重設密碼連結已發送到您的 Email" 訊息

## 瀏覽器開發者工具測試

### 檢查 Network 請求：
1. 打開瀏覽器開發者工具
2. 切換到 Network 標籤
3. 執行註冊和登入操作
4. 檢查 API 請求是否正確發送
5. 檢查響應狀態碼和資料

### 檢查 localStorage：
1. 在開發者工具中切換到 Application 標籤
2. 在左側選擇 Local Storage
3. 登入後應該看到 `token` 和 `user` 項目
4. 登出後這些項目應該被清除

### 檢查 Console 錯誤：
1. 在開發者工具中切換到 Console 標籤
2. 執行各種操作，確保沒有 JavaScript 錯誤

## 後端 API 測試

### 使用 Postman 或 curl 測試：

#### 註冊 API：
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser2",
    "email": "test2@example.com",
    "password": "password123"
  }'
```

#### 登入 API：
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### 驗證 Token API：
```bash
curl -X GET http://localhost:3000/api/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 常見問題排查

### 1. CORS 錯誤
- 確認後端 CORS 設定正確
- 檢查前端 API 端點設定

### 2. MongoDB 連線錯誤
- 確認 MongoDB 服務正在運行
- 檢查 MONGODB_URI 設定

### 3. JWT Token 錯誤
- 確認 JWT_SECRET 設定正確
- 檢查 token 格式是否正確

### 4. 路由不工作
- 確認 Vue Router 設定正確
- 檢查路由守衛邏輯

## 性能測試

### 載入時間測試：
1. 使用瀏覽器開發者工具的 Performance 標籤
2. 記錄頁面載入時間
3. 檢查是否有不必要的 API 請求

### 記憶體使用測試：
1. 使用開發者工具的 Memory 標籤
2. 執行多次登入/登出操作
3. 檢查是否有記憶體洩漏

## 安全性測試

### XSS 測試：
1. 嘗試在輸入欄位中輸入 JavaScript 代碼
2. 確認代碼不會被執行

### CSRF 測試：
1. 檢查 API 請求是否包含適當的 headers
2. 確認後端有適當的 CSRF 保護

### SQL 注入測試：
1. 嘗試在輸入欄位中輸入 SQL 代碼
2. 確認不會造成資料庫問題 