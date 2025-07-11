# 同時啟動前端和後端開發服務器
Write-Host "正在啟動 PetMap 開發環境..." -ForegroundColor Green

# 啟動後端服務器
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Normal

# 等待 2 秒讓後端啟動
Start-Sleep -Seconds 2

# 啟動前端開發服務器
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal

Write-Host "開發環境啟動完成！" -ForegroundColor Green
Write-Host "後端運行在: http://localhost:3000" -ForegroundColor Yellow
Write-Host "前端運行在: http://localhost:5173" -ForegroundColor Yellow 