@echo off

REM 🚀 Quick Start Script - DIMEC Inventory System
REM ================================================

echo 🧾 Starting DIMEC Inventory System...
echo.

REM Check if run.bat exists
if not exist "run.bat" (
    echo ❌ Error: run.bat not found in current directory
    pause
    exit /b 1
)

REM Start the system
call run.bat start
