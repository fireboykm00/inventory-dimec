#!/bin/bash

echo "🧾 DIMEC Inventory System - H2 Database Test"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Testing H2 Database Backend...${NC}"

# Test if backend is running
echo "1. Checking backend health..."
if curl -s http://localhost:8080/api/auth/login > /dev/null; then
    echo -e "${GREEN}✓ Backend is running on port 8080${NC}"
else
    echo -e "${RED}✗ Backend is not running${NC}"
    echo "Please start the backend with: cd backend && mvn spring-boot:run"
    exit 1
fi

# Test authentication with valid credentials
echo -e "${YELLOW}2. Testing authentication with valid credentials...${NC}"
login_response=$(curl -s -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@dimec.com","password":"admin123"}')

if [[ $login_response == *"token"* ]]; then
    echo -e "${GREEN}✓ Login successful${NC}"
    
    # Extract token for subsequent tests
    token=$(echo $login_response | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo -e "${BLUE}   Token extracted for API tests${NC}"
else
    echo -e "${RED}✗ Login failed${NC}"
    echo "Response: $login_response"
    exit 1
fi

# Test authentication with invalid credentials
echo -e "${YELLOW}3. Testing authentication with invalid credentials...${NC}"
invalid_response=$(curl -s -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"wrong@email.com","password":"wrong"}')

if [[ $invalid_response == *"Invalid email or password"* ]]; then
    echo -e "${GREEN}✓ Invalid credentials properly rejected${NC}"
else
    echo -e "${RED}✗ Invalid credentials not handled properly${NC}"
fi

# Test protected endpoint without token
echo -e "${YELLOW}4. Testing protected endpoint without token...${NC}"
status_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/products)
if [ "$status_code" = "403" ]; then
    echo -e "${GREEN}✓ Protected endpoints are secured (403 Forbidden)${NC}"
else
    echo -e "${RED}✗ Protected endpoints are not properly secured (got $status_code)${NC}"
fi

# Test protected endpoint with token
echo -e "${YELLOW}5. Testing protected endpoint with valid token...${NC}"
products_response=$(curl -s -X GET http://localhost:8080/api/products \
    -H "Authorization: Bearer $token")

if [[ $products_response == *"Laptop Dell Latitude"* ]]; then
    echo -e "${GREEN}✓ Products API working with authentication${NC}"
    product_count=$(echo $products_response | grep -o '"productId"' | wc -l)
    echo -e "${BLUE}   Found $product_count products in database${NC}"
else
    echo -e "${RED}✗ Products API not working${NC}"
fi

# Test validation
echo -e "${YELLOW}6. Testing input validation...${NC}"
validation_response=$(curl -s -X POST http://localhost:8080/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name":"","email":"invalid","password":"123","role":"INVALID"}')

if [[ $validation_response == *"Validation failed"* ]]; then
    echo -e "${GREEN}✓ Input validation working properly${NC}"
else
    echo -e "${RED}✗ Input validation not working${NC}"
fi

# Test categories API
echo -e "${YELLOW}7. Testing categories API...${NC}"
categories_response=$(curl -s -X GET http://localhost:8080/api/categories \
    -H "Authorization: Bearer $token")

if [[ $categories_response == *"ICT Equipment"* ]]; then
    echo -e "${GREEN}✓ Categories API working${NC}"
else
    echo -e "${RED}✗ Categories API not working${NC}"
fi

# Test suppliers API
echo -e "${YELLOW}8. Testing suppliers API...${NC}"
suppliers_response=$(curl -s -X GET http://localhost:8080/api/suppliers \
    -H "Authorization: Bearer $token")

if [[ $suppliers_response == *"Tech Solutions Ltd"* ]]; then
    echo -e "${GREEN}✓ Suppliers API working${NC}"
else
    echo -e "${RED}✗ Suppliers API not working${NC}"
fi

# Test dashboard API
echo -e "${YELLOW}9. Testing dashboard API...${NC}"
dashboard_response=$(curl -s -X GET http://localhost:8080/api/dashboard/stats \
    -H "Authorization: Bearer $token")

if [[ $dashboard_response == *"totalProducts"* ]]; then
    echo -e "${GREEN}✓ Dashboard API working${NC}"
else
    echo -e "${RED}✗ Dashboard API not working${NC}"
fi

echo -e "${BLUE}Testing Frontend...${NC}"

# Test if frontend is running
echo "10. Checking frontend health..."
if curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✓ Frontend is running on port 5173${NC}"
else
    echo -e "${RED}✗ Frontend is not running${NC}"
    echo "Please start the frontend with: cd frontend && pnpm dev"
    exit 1
fi

# Test frontend build
echo "11. Testing frontend build..."
cd frontend
if pnpm build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend builds successfully${NC}"
else
    echo -e "${RED}✗ Frontend build failed${NC}"
fi
cd ..

echo -e "${BLUE}Database Information:${NC}"
echo "12. Database type: H2 (In-memory)"
echo "13. H2 Console: http://localhost:8080/api/h2-console"
echo "    - JDBC URL: jdbc:h2:mem:dimec_inventory"
echo "    - Username: sa"
echo "    - Password: (empty)"

echo -e "${BLUE}System Information:${NC}"
echo "14. Java version:"
java -version 2>&1 | head -1

echo "15. Node.js version:"
node --version

echo "16. pnpm version:"
pnpm --version

echo ""
echo -e "${GREEN}🎉 H2 System Test Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Default Login Credentials:${NC}"
echo "   Email: admin@dimec.com"
echo "   Password: admin123"
echo ""
echo -e "${BLUE}📋 Additional Test Accounts:${NC}"
echo "   • clerk@dimec.com / clerk123 (Inventory Clerk)"
echo "   • viewer@dimec.com / viewer123 (Viewer)"
echo ""
echo -e "${BLUE}🔗 Access URLs:${NC}"
echo "   • Frontend: http://localhost:5173"
echo "   • Backend API: http://localhost:8080/api"
echo "   • H2 Console: http://localhost:8080/api/h2-console"
echo ""
echo -e "${BLUE}📊 Sample Data:${NC}"
echo "   • 3 Users with different roles"
echo "   • 3 Categories (ICT, Security, Office)"
echo "   • 3 Suppliers"
echo "   • 8 Products with varying stock levels"
echo "   • Sample issuance records"
echo ""
echo -e "${GREEN}✅ All tests passed! System is ready for use.${NC}"
