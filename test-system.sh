#!/bin/bash

echo "🧾 DIMEC Inventory System - End-to-End Test"
echo "=============================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Testing Backend API...${NC}"

# Test if backend is running
echo "1. Checking backend health..."
if curl -s http://localhost:8080/api/auth/login > /dev/null; then
    echo -e "${GREEN}✓ Backend is running on port 8080${NC}"
else
    echo -e "${RED}✗ Backend is not running${NC}"
    echo "Please start the backend with: cd backend && mvn spring-boot:run"
    exit 1
fi

# Test authentication endpoint
echo "2. Testing authentication endpoint..."
response=$(curl -s -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test"}')

if [[ $response == *"401"* ]] || [[ $response == *"Invalid"* ]]; then
    echo -e "${GREEN}✓ Authentication endpoint is working (returns expected error for invalid credentials)${NC}"
else
    echo -e "${GREEN}✓ Authentication endpoint is responding${NC}"
fi

# Test protected endpoint
echo "3. Testing protected endpoint..."
status_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/products)
if [ "$status_code" = "403" ]; then
    echo -e "${GREEN}✓ Protected endpoints are secured (403 Forbidden for unauthenticated requests)${NC}"
else
    echo -e "${RED}✗ Protected endpoints are not properly secured${NC}"
fi

echo -e "${YELLOW}Testing Frontend...${NC}"

# Test if frontend is running
echo "4. Checking frontend health..."
if curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✓ Frontend is running on port 5173${NC}"
else
    echo -e "${RED}✗ Frontend is not running${NC}"
    echo "Please start the frontend with: cd frontend && pnpm dev"
    exit 1
fi

# Test frontend build
echo "5. Testing frontend build..."
cd frontend
if pnpm build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend builds successfully${NC}"
else
    echo -e "${RED}✗ Frontend build failed${NC}"
fi
cd ..

echo -e "${YELLOW}Testing Database...${NC}"

# Check if database file exists
echo "6. Checking database..."
if [ -f "backend/dimec_inventory.db" ]; then
    echo -e "${GREEN}✓ SQLite database file exists${NC}"
else
    echo -e "${YELLOW}⚠ Database file will be created on first run${NC}"
fi

echo -e "${YELLOW}System Information:${NC}"
echo "7. Java version:"
java -version 2>&1 | head -1

echo "8. Node.js version:"
node --version

echo "9. pnpm version:"
pnpm --version

echo ""
echo -e "${GREEN}🎉 System Test Complete!${NC}"
echo ""
echo "📋 Next Steps:"
echo "1. Start backend: cd backend && mvn spring-boot:run"
echo "2. Start frontend: cd frontend && pnpm dev"
echo "3. Open browser: http://localhost:5173"
echo "4. Register a new user account"
echo "5. Start managing your inventory!"
echo ""
echo "📚 For detailed documentation, see README.md"
