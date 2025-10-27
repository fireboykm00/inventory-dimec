# 🚀 DIMEC Inventory System - Run Scripts Guide

## 📋 Overview

Two comprehensive run scripts are provided to easily start, stop, and manage the DIMEC Inventory System:

- **`run.sh`** - For Linux/macOS systems
- **`run.bat`** - For Windows systems

Both scripts handle:
- ✅ Dependency installation (Java, Maven, Node.js, npm)
- ✅ Port conflict resolution
- ✅ Service startup and management
- ✅ Log monitoring
- ✅ Status checking

## 🎯 Quick Start

### Linux/macOS
```bash
# Start the system
./run.sh start

# Or simply (start is default)
./run.sh
```

### Windows
```cmd
# Start the system
run.bat start

# Or simply (start is default)
run.bat
```

## 📖 Available Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `start` | Start all services (default) | `./run.sh start` |
| `stop` | Stop all services | `./run.sh stop` |
| `restart` | Restart all services | `./run.sh restart` |
| `status` | Show service status | `./run.sh status` |
| `logs` | Show service logs | `./run.sh logs` |
| `setup` | Install dependencies only | `./run.sh setup` |

## 🔧 Features

### 🚦 **Smart Port Management**
- Automatically detects and stops processes on ports 8080 and 5173
- Prevents port conflicts before starting services
- Graceful shutdown with PID tracking

### 📦 **Dependency Installation**
- **Backend**: Java 17+, Maven 3.6+
- **Frontend**: Node.js 18+, npm 8+
- Automatic installation on most systems
- Manual installation guidance when needed

### 📊 **Service Monitoring**
- Real-time startup verification
- Health checks with timeout protection
- Comprehensive logging system
- Status reporting with colored output

### 🛠️ **Cross-Platform Support**
- Native support for Linux, macOS, and Windows
- Platform-specific package manager integration
- Consistent behavior across all platforms

## 🌐 Access Points

Once started, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Main application interface |
| **Backend API** | http://localhost:8080/api | REST API endpoints |
| **API Documentation** | http://localhost:8080/swagger-ui.html | Interactive API docs |
| **H2 Database Console** | http://localhost:8080/h2-console | Database management |
| **Health Check** | http://localhost:8080/api/health | Service health status |

## 🔐 Default Credentials

```
Email: admin@dimec.com
Password: admin123
Role: ADMIN
```

## 📝 Detailed Usage Examples

### **Starting the System**
```bash
# Linux/macOS
./run.sh start

# Windows
run.bat start
```

**Expected Output:**
```
================================
🧾 DIMEC Inventory System
================================
[INFO] Starting DIMEC Inventory System...
[INFO] Stopping existing services...
[INFO] Backend is not running on port 8080
[INFO] Frontend is not running on port 5173
[INFO] Setting up backend...
[SUCCESS] Java is available: openjdk version "17.0.8"
[SUCCESS] Maven is available: Apache Maven 3.9.4
[SUCCESS] Backend dependencies installed successfully
[INFO] Setting up frontend...
[SUCCESS] Node.js is available: v18.17.0
[SUCCESS] npm is available: 9.6.7
[SUCCESS] Frontend dependencies installed successfully
[INFO] Starting backend server...
[SUCCESS] Backend started successfully on port 8080
[INFO] Starting frontend server...
[SUCCESS] Frontend started successfully on port 5173

🎉 DIMEC Inventory System is now running!
Backend:  http://localhost:8080
Frontend: http://localhost:5173
API Docs:  http://localhost:8080/swagger-ui.html
H2 Console: http://localhost:8080/h2-console

Press Ctrl+C to stop all services
```

### **Checking Service Status**
```bash
# Linux/macOS
./run.sh status

# Windows
run.bat status
```

**Expected Output:**
```
[INFO] Checking service status...
[SUCCESS] Backend is running on port 8080
[SUCCESS] Frontend is running on port 5173
```

### **Viewing Logs**
```bash
# Linux/macOS
./run.sh logs

# Windows
run.bat logs
```

**Expected Output:**
```
[INFO] Showing logs...

--- Backend Log ---
2025-10-27 19:45:00.123  INFO 12345 --- [           main] com.dimec.inventory.InventoryApplication  : Started InventoryApplication in 3.456 seconds
2025-10-27 19:45:00.456  INFO 12345 --- [           main] com.dimec.inventory.config.DataInitializer  : Database initialized with sample data

--- Frontend Log ---
  VITE v5.0.0  ready in 345 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### **Stopping Services**
```bash
# Linux/macOS
./run.sh stop

# Windows
run.bat stop
```

**Expected Output:**
```
[INFO] Stopping existing services...
[WARNING] Port 8080 is in use. Attempting to stop Backend...
[SUCCESS] Backend stopped successfully
[WARNING] Port 5173 is in use. Attempting to stop Frontend...
[SUCCESS] Frontend stopped successfully
[SUCCESS] All services stopped
```

## 🔧 Troubleshooting

### **Port Already in Use**
The scripts automatically handle port conflicts, but if you need manual intervention:

```bash
# Linux/macOS - Find and kill process
lsof -ti:8080 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Windows - Find and kill process
netstat -ano | findstr :8080
taskkill /F /PID <PID>
```

### **Java Not Found**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# macOS (with Homebrew)
brew install openjdk@17

# Windows
# Download from: https://adoptium.net/temurin/releases/?version=17
```

### **Node.js Not Found**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS (with Homebrew)
brew install node

# Windows
# Download from: https://nodejs.org/
```

### **Maven Not Found**
```bash
# Ubuntu/Debian
sudo apt install maven

# macOS (with Homebrew)
brew install maven

# Windows
# Download from: https://maven.apache.org/download.cgi
```

### **Permission Denied (Linux/macOS)**
```bash
# Make script executable
chmod +x run.sh

# Or run with sudo if needed
sudo ./run.sh start
```

## 📁 File Structure After Running

```
inventory-dimec/
├── run.sh                    # Linux/macOS startup script
├── run.bat                   # Windows startup script
├── backend.log               # Backend service logs
├── frontend.log              # Frontend service logs
├── backend.pid               # Backend process ID
├── frontend.pid              # Frontend process ID
├── backend/                  # Spring Boot backend
│   ├── target/               # Compiled Java classes
│   └── pom.xml               # Maven configuration
└── frontend/                 # React frontend
    ├── node_modules/         # npm dependencies
    ├── dist/                 # Built frontend files
    └── package.json          # npm configuration
```

## 🔄 Development Workflow

### **First Time Setup**
```bash
# Install dependencies only
./run.sh setup

# Then start the system
./run.sh start
```

### **Development Cycle**
```bash
# Make changes to code
# Restart services to apply changes
./run.sh restart

# Check status
./run.sh status

# View logs if issues occur
./run.sh logs
```

### **Clean Shutdown**
```bash
# Properly stop all services
./run.sh stop

# Clean up generated files
rm -f *.log *.pid
```

## 🎯 Best Practices

1. **Always use the scripts** to start/stop services for proper cleanup
2. **Check logs** if services fail to start
3. **Verify status** before making changes
4. **Use setup command** for first-time installation
5. **Monitor ports** if you have other services running

## 📞 Support

If you encounter issues:

1. **Check the logs**: `./run.sh logs`
2. **Verify dependencies**: `./run.sh setup`
3. **Check port conflicts**: `./run.sh status`
4. **Restart services**: `./run.sh restart`
5. **Review this guide** for troubleshooting steps

## 🎉 Success Indicators

When everything is working correctly, you should see:

- ✅ Green success messages for all services
- ✅ Both ports 8080 and 5173 are active
- ✅ Frontend loads at http://localhost:5173
- ✅ Backend API responds at http://localhost:8080/api
- ✅ Login works with default credentials
- ✅ Dashboard displays statistics
- ✅ Quick actions navigate properly

The system is now ready for production use! 🚀
