#!/bin/bash

# 🧾 DIMEC Inventory System - Startup Script (Linux/macOS)
# =========================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
BACKEND_PORT=8080
FRONTEND_PORT=5173
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}🧾 DIMEC Inventory System${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    local service_name=$2
    
    if check_port $port; then
        print_warning "Port $port is in use. Attempting to stop $service_name..."
        
        # Find and kill the process
        local pid=$(lsof -ti:$port)
        if [ ! -z "$pid" ]; then
            kill -9 $pid 2>/dev/null
            sleep 2
            
            if check_port $port; then
                print_error "Failed to stop $service_name on port $port"
                return 1
            else
                print_success "$service_name stopped successfully"
                return 0
            fi
        fi
    else
        print_status "$service_name is not running on port $port"
        return 0
    fi
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Java (if needed)
install_java() {
    if ! command_exists java; then
        print_warning "Java not found. Installing Java 17..."
        
        if command_exists apt-get; then
            sudo apt-get update
            sudo apt-get install -y openjdk-17-jdk
        elif command_exists yum; then
            sudo yum install -y java-17-openjdk-devel
        elif command_exists brew; then
            brew install openjdk@17
        else
            print_error "Cannot install Java automatically. Please install Java 17 manually."
            exit 1
        fi
    else
        local java_version=$(java -version 2>&1 | head -n1 | cut -d'"' -f2 | cut -d'.' -f1)
        if [ "$java_version" -lt 17 ]; then
            print_warning "Java version $java_version detected. Java 17+ recommended."
        fi
    fi
    
    print_success "Java is available: $(java -version 2>&1 | head -n1)"
}

# Function to install Maven (if needed)
install_maven() {
    if ! command_exists mvn; then
        print_warning "Maven not found. Installing Maven..."
        
        if command_exists apt-get; then
            sudo apt-get install -y maven
        elif command_exists yum; then
            sudo yum install -y maven
        elif command_exists brew; then
            brew install maven
        else
            print_error "Cannot install Maven automatically. Please install Maven manually."
            exit 1
        fi
    else
        print_success "Maven is available: $(mvn -version | head -n1)"
    fi
}

# Function to install Node.js (if needed)
install_nodejs() {
    if ! command_exists node; then
        print_warning "Node.js not found. Installing Node.js..."
        
        if command_exists apt-get; then
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        elif command_exists yum; then
            curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
            sudo yum install -y nodejs npm
        elif command_exists brew; then
            brew install node
        else
            print_error "Cannot install Node.js automatically. Please install Node.js manually."
            exit 1
        fi
    else
        local node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$node_version" -lt 18 ]; then
            print_warning "Node.js version $(node --version) detected. Node.js 18+ recommended."
        fi
        print_success "Node.js is available: $(node --version)"
    fi
}

# Function to install npm (if needed)
install_npm() {
    if ! command_exists npm; then
        print_warning "npm not found. Installing npm..."
        
        if command_exists apt-get; then
            sudo apt-get install -y npm
        elif command_exists yum; then
            sudo yum install -y npm
        else
            print_error "Cannot install npm automatically. Please install npm manually."
            exit 1
        fi
    else
        print_success "npm is available: $(npm --version)"
    fi
}

# Function to setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    if [ ! -d "$BACKEND_DIR" ]; then
        print_error "Backend directory not found: $BACKEND_DIR"
        exit 1
    fi
    
    cd $BACKEND_DIR
    
    # Check and install dependencies
    install_java
    install_maven
    
    # Install Maven dependencies
    print_status "Installing Maven dependencies..."
    if mvn clean install -DskipTests; then
        print_success "Backend dependencies installed successfully"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    
    cd ..
}

# Function to setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        print_error "Frontend directory not found: $FRONTEND_DIR"
        exit 1
    fi
    
    cd $FRONTEND_DIR
    
    # Check and install dependencies
    install_nodejs
    install_npm
    
    # Install npm dependencies
    print_status "Installing npm dependencies..."
    if npm install; then
        print_success "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    
    cd ..
}

# Function to start backend
start_backend() {
    print_status "Starting backend server..."
    
    cd $BACKEND_DIR
    
    # Start backend in background
    mvn spring-boot:run > ../backend.log 2>&1 &
    BACKEND_PID=$!
    
    # Wait for backend to start
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if check_port $BACKEND_PORT; then
            print_success "Backend started successfully on port $BACKEND_PORT (PID: $BACKEND_PID)"
            echo $BACKEND_PID > ../backend.pid
            cd ..
            return 0
        fi
        
        sleep 2
        attempt=$((attempt + 1))
        print_status "Waiting for backend to start... ($attempt/$max_attempts)"
    done
    
    print_error "Backend failed to start within timeout"
    kill $BACKEND_PID 2>/dev/null
    cd ..
    exit 1
}

# Function to start frontend
start_frontend() {
    print_status "Starting frontend server..."
    
    cd $FRONTEND_DIR
    
    # Start frontend in background
    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Wait for frontend to start
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if check_port $FRONTEND_PORT; then
            print_success "Frontend started successfully on port $FRONTEND_PORT (PID: $FRONTEND_PID)"
            echo $FRONTEND_PID > ../frontend.pid
            cd ..
            return 0
        fi
        
        sleep 2
        attempt=$((attempt + 1))
        print_status "Waiting for frontend to start... ($attempt/$max_attempts)"
    done
    
    print_error "Frontend failed to start within timeout"
    kill $FRONTEND_PID 2>/dev/null
    cd ..
    exit 1
}

# Function to stop services
stop_services() {
    print_status "Stopping existing services..."
    
    # Stop backend
    kill_port $BACKEND_PORT "Backend"
    
    # Stop frontend
    kill_port $FRONTEND_PORT "Frontend"
    
    # Clean up PID files
    [ -f backend.pid ] && rm -f backend.pid
    [ -f frontend.pid ] && rm -f frontend.pid
    [ -f backend.log ] && rm -f backend.log
    [ -f frontend.log ] && rm -f frontend.log
}

# Function to show status
show_status() {
    print_status "Checking service status..."
    
    if check_port $BACKEND_PORT; then
        print_success "Backend is running on port $BACKEND_PORT"
    else
        print_warning "Backend is not running"
    fi
    
    if check_port $FRONTEND_PORT; then
        print_success "Frontend is running on port $FRONTEND_PORT"
    else
        print_warning "Frontend is not running"
    fi
}

# Function to show logs
show_logs() {
    print_status "Showing logs..."
    
    if [ -f backend.log ]; then
        echo -e "\n${CYAN}--- Backend Log ---${NC}"
        tail -20 backend.log
    fi
    
    if [ -f frontend.log ]; then
        echo -e "\n${CYAN}--- Frontend Log ---${NC}"
        tail -20 frontend.log
    fi
}

# Main execution
main() {
    print_header
    
    case "${1:-start}" in
        "start")
            print_status "Starting DIMEC Inventory System..."
            
            # Stop existing services
            stop_services
            
            # Setup dependencies
            setup_backend
            setup_frontend
            
            # Start services
            start_backend
            start_frontend
            
            echo ""
            print_success "🎉 DIMEC Inventory System is now running!"
            echo -e "${GREEN}Backend:${NC}  http://localhost:$BACKEND_PORT"
            echo -e "${GREEN}Frontend:${NC} http://localhost:$FRONTEND_PORT"
            echo -e "${GREEN}API Docs:${NC}  http://localhost:$BACKEND_PORT/swagger-ui.html"
            echo -e "${GREEN}H2 Console:${NC} http://localhost:$BACKEND_PORT/h2-console"
            echo ""
            echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
            
            # Wait for interrupt signal
            trap 'stop_services; exit 0' INT
            while true; do
                sleep 1
            done
            ;;
        "stop")
            stop_services
            print_success "All services stopped"
            ;;
        "restart")
            stop_services
            sleep 2
            main start
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs
            ;;
        "setup")
            print_status "Setting up dependencies only..."
            setup_backend
            setup_frontend
            print_success "Dependencies setup completed"
            ;;
        *)
            echo "Usage: $0 {start|stop|restart|status|logs|setup}"
            echo ""
            echo "Commands:"
            echo "  start   - Start all services (default)"
            echo "  stop    - Stop all services"
            echo "  restart - Restart all services"
            echo "  status  - Show service status"
            echo "  logs    - Show service logs"
            echo "  setup   - Install dependencies only"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
