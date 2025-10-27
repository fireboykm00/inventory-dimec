@echo off
setlocal enabledelayedexpansion

REM 🧾 DIMEC Inventory System - Startup Script (Windows)
REM =====================================================

title DIMEC Inventory System

REM Configuration
set BACKEND_PORT=8080
set FRONTEND_PORT=5173
set BACKEND_DIR=backend
set FRONTEND_DIR=frontend

REM Colors (Windows 10+)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "PURPLE=[95m"
set "CYAN=[96m"
set "NC=[0m"

REM Function to print colored output
:print_status
echo %BLUE%[INFO]%NC% %~1
goto :eof

:print_success
echo %GREEN%[SUCCESS]%NC% %~1
goto :eof

:print_warning
echo %YELLOW%[WARNING]%NC% %~1
goto :eof

:print_error
echo %RED%[ERROR]%NC% %~1
goto :eof

:print_header
echo %PURPLE%================================%NC%
echo %PURPLE%🧾 DIMEC Inventory System%NC%
echo %PURPLE%================================%NC%
goto :eof

REM Function to check if port is in use
:check_port
netstat -ano | findstr ":%~1" | findstr "LISTENING" >nul
goto :eof

REM Function to kill process on port
:kill_port
call :check_port %~1
if !errorlevel! equ 0 (
    call :print_warning "Port %~1 is in use. Attempting to stop %~2..."
    
    REM Find and kill the process
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%~1" ^| findstr "LISTENING"') do (
        taskkill /F /PID %%a >nul 2>&1
        if !errorlevel! equ 0 (
            call :print_success "%~2 stopped successfully"
            goto :kill_port_done
        ) else (
            call :print_error "Failed to stop %~2 on port %~1"
        )
    )
) else (
    call :print_status "%~2 is not running on port %~1"
)
:kill_port_done
goto :eof

REM Function to check if command exists
:command_exists
where %~1 >nul 2>&1
goto :eof

REM Function to install Java (manual instructions)
:install_java
call :command_exists java
if !errorlevel! neq 0 (
    call :print_warning "Java not found. Please install Java 17 manually:"
    echo "1. Download from: https://adoptium.net/temurin/releases/?version=17"
    echo "2. Install and add to PATH"
    echo "3. Run this script again"
    pause
    exit /b 1
) else (
    for /f "tokens=3" %%a in ('java -version 2^>^&1 ^| findstr "version"') do (
        set "java_version=%%a"
    )
    call :print_success "Java is available"
)
goto :eof

REM Function to install Maven (manual instructions)
:install_maven
call :command_exists mvn
if !errorlevel! neq 0 (
    call :print_warning "Maven not found. Please install Maven manually:"
    echo "1. Download from: https://maven.apache.org/download.cgi"
    echo "2. Extract and add to PATH"
    echo "3. Run this script again"
    pause
    exit /b 1
) else (
    call :print_success "Maven is available"
)
goto :eof

REM Function to install Node.js
:install_nodejs
call :command_exists node
if !errorlevel! neq 0 (
    call :print_warning "Node.js not found. Installing Node.js..."
    
    REM Try to install with chocolatey if available
    call :command_exists choco
    if !errorlevel! equ 0 (
        choco install nodejs -y
    ) else (
        call :print_warning "Please install Node.js manually:"
        echo "1. Download from: https://nodejs.org/"
        echo "2. Install LTS version"
        echo "3. Run this script again"
        pause
        exit /b 1
    )
) else (
    call :print_success "Node.js is available: "
    node --version
)
goto :eof

REM Function to install npm
:install_npm
call :command_exists npm
if !errorlevel! neq 0 (
    call :print_warning "npm not found. Installing npm..."
    
    REM npm usually comes with Node.js
    call :install_nodejs
) else (
    call :print_success "npm is available: "
    npm --version
)
goto :eof

REM Function to setup backend
:setup_backend
call :print_status "Setting up backend..."

if not exist "%BACKEND_DIR%" (
    call :print_error "Backend directory not found: %BACKEND_DIR%"
    pause
    exit /b 1
)

cd %BACKEND_DIR%

REM Check and install dependencies
call :install_java
call :install_maven

REM Install Maven dependencies
call :print_status "Installing Maven dependencies..."
mvn clean install -DskipTests
if !errorlevel! neq 0 (
    call :print_error "Failed to install backend dependencies"
    pause
    exit /b 1
)

call :print_success "Backend dependencies installed successfully"
cd ..
goto :eof

REM Function to setup frontend
:setup_frontend
call :print_status "Setting up frontend..."

if not exist "%FRONTEND_DIR%" (
    call :print_error "Frontend directory not found: %FRONTEND_DIR%"
    pause
    exit /b 1
)

cd %FRONTEND_DIR%

REM Check and install dependencies
call :install_nodejs
call :install_npm

REM Install npm dependencies
call :print_status "Installing npm dependencies..."
npm install
if !errorlevel! neq 0 (
    call :print_error "Failed to install frontend dependencies"
    pause
    exit /b 1
)

call :print_success "Frontend dependencies installed successfully"
cd ..
goto :eof

REM Function to start backend
:start_backend
call :print_status "Starting backend server..."

cd %BACKEND_DIR%

REM Start backend in background
start "Backend" cmd /c "mvn spring-boot:run > ..\backend.log 2>&1"

REM Wait for backend to start
set /a max_attempts=30
set /a attempt=0

:wait_backend
call :check_port %BACKEND_PORT%
if !errorlevel! equ 0 (
    call :print_success "Backend started successfully on port %BACKEND_PORT%"
    cd ..
    goto :start_backend_done
)

set /a attempt+=1
if !attempt! geq %max_attempts% (
    call :print_error "Backend failed to start within timeout"
    cd ..
    pause
    exit /b 1
)

call :print_status "Waiting for backend to start... (!attempt!/!max_attempts!)"
timeout /t 2 /nobreak >nul
goto wait_backend

:start_backend_done
goto :eof

REM Function to start frontend
:start_frontend
call :print_status "Starting frontend server..."

cd %FRONTEND_DIR%

REM Start frontend in background
start "Frontend" cmd /c "npm run dev > ..\frontend.log 2>&1"

REM Wait for frontend to start
set /a max_attempts=30
set /a attempt=0

:wait_frontend
call :check_port %FRONTEND_PORT%
if !errorlevel! equ 0 (
    call :print_success "Frontend started successfully on port %FRONTEND_PORT%"
    cd ..
    goto :start_frontend_done
)

set /a attempt+=1
if !attempt! geq %max_attempts% (
    call :print_error "Frontend failed to start within timeout"
    cd ..
    pause
    exit /b 1
)

call :print_status "Waiting for frontend to start... (!attempt!/!max_attempts!)"
timeout /t 2 /nobreak >nul
goto wait_frontend

:start_frontend_done
goto :eof

REM Function to stop services
:stop_services
call :print_status "Stopping existing services..."

REM Stop backend
call :kill_port %BACKEND_PORT% "Backend"

REM Stop frontend
call :kill_port %FRONTEND_PORT% "Frontend"

REM Kill any remaining processes
taskkill /F /IM "java.exe" 2>nul
taskkill /F /IM "node.exe" 2>nul

REM Clean up files
if exist backend.pid del backend.pid
if exist frontend.pid del frontend.pid
if exist backend.log del backend.log
if exist frontend.log del frontend.log
goto :eof

REM Function to show status
:show_status
call :print_status "Checking service status..."

call :check_port %BACKEND_PORT%
if !errorlevel! equ 0 (
    call :print_success "Backend is running on port %BACKEND_PORT%"
) else (
    call :print_warning "Backend is not running"
)

call :check_port %FRONTEND_PORT%
if !errorlevel! equ 0 (
    call :print_success "Frontend is running on port %FRONTEND_PORT%"
) else (
    call :print_warning "Frontend is not running"
)
goto :eof

REM Function to show logs
:show_logs
call :print_status "Showing logs..."

if exist backend.log (
    echo.
    echo %CYAN%--- Backend Log ---%NC%
    powershell "Get-Content backend.log | Select-Object -Last 20"
)

if exist frontend.log (
    echo.
    echo %CYAN%--- Frontend Log ---%NC%
    powershell "Get-Content frontend.log | Select-Object -Last 20"
)
goto :eof

REM Main execution
:main
call :print_header

if "%1"=="" set "action=start"
if "%1"=="" set "action=start"

if "%1"=="start" set "action=start"
if "%1"=="stop" set "action=stop"
if "%1"=="restart" set "action=restart"
if "%1"=="status" set "action=status"
if "%1"=="logs" set "action=logs"
if "%1"=="setup" set "action=setup"

if "%action%"=="start" (
    call :print_status "Starting DIMEC Inventory System..."
    
    REM Stop existing services
    call :stop_services
    
    REM Setup dependencies
    call :setup_backend
    call :setup_frontend
    
    REM Start services
    call :start_backend
    call :start_frontend
    
    echo.
    call :print_success "🎉 DIMEC Inventory System is now running!"
    echo %GREEN%Backend:%NC  http://localhost:%BACKEND_PORT%
    echo %GREEN%Frontend:%NC% http://localhost:%FRONTEND_PORT%
    echo %GREEN%API Docs:%NC%  http://localhost:%BACKEND_PORT%/swagger-ui.html
    echo %GREEN%H2 Console:%NC% http://localhost:%BACKEND_PORT%/h2-console
    echo.
    echo %YELLOW%Press any key to stop all services%NC%
    pause >nul
    call :stop_services
    goto :main_done
)

if "%action%"=="stop" (
    call :stop_services
    call :print_success "All services stopped"
    goto :main_done
)

if "%action%"=="restart" (
    call :stop_services
    timeout /t 2 /nobreak >nul
    call :main start
    goto :main_done
)

if "%action%"=="status" (
    call :show_status
    goto :main_done
)

if "%action%"=="logs" (
    call :show_logs
    goto :main_done
)

if "%action%"=="setup" (
    call :print_status "Setting up dependencies only..."
    call :setup_backend
    call :setup_frontend
    call :print_success "Dependencies setup completed"
    goto :main_done
)

echo Usage: %0 {start^|stop^|restart^|status^|logs^|setup}
echo.
echo Commands:
echo   start   - Start all services (default)
echo   stop    - Stop all services
echo   restart - Restart all services
echo   status  - Show service status
echo   logs    - Show service logs
echo   setup   - Install dependencies only
pause
exit /b 1

:main_done
goto :eof

REM Call main function with arguments
call :main %*
