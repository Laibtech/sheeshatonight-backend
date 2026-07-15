@echo off
echo ================================
echo Starting SheeshaTonight Dev Servers
echo ================================
echo.

REM Start Backend Server
echo Starting Backend Server on port 5000...
start "Backend Server" cmd /k "cd backend && npm run dev"

REM Wait a bit for backend to start
timeout /t 5 /nobreak >nul

REM Start Frontend Server
echo Starting Frontend Server on port 3000...
start "Frontend Server" cmd /k "cd sheeshatonight-main && npm run dev"

echo.
echo ================================
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ================================
echo.
echo Press any key to exit this window...
pause >nul
