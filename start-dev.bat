@echo off
echo 正在啟動 PetMap 開發環境...

REM 啟動後端服務器
start "Backend Server" cmd /k "cd backend && npm run dev"

REM 等待 2 秒
timeout /t 2 /nobreak > nul

REM 啟動前端開發服務器
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo 開發環境啟動完成！
echo 後端運行在: http://localhost:3000
echo 前端運行在: http://localhost:5173
pause 