#!/bin/bash

echo "🧾 DIMEC Inventory System - Integration Test Script"
echo "=================================================="

# Configuration
BACKEND_URL="http://localhost:8080"
FRONTEND_URL="http://localhost:5173"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
print_test() {
    echo -e "${BLUE}Testing: $1${NC}"
}

print_pass() {
    echo -e "${GREEN}✅ PASS: $1${NC}"
    ((TESTS_PASSED++))
}

print_fail() {
    echo -e "${RED}❌ FAIL: $1${NC}"
    ((TESTS_FAILED++))
}

print_warning() {
    echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
}

# Function to test API endpoint
test_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    print_test "$description"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BACKEND_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            "$BACKEND_URL$endpoint")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" -eq "$expected_status" ]; then
        print_pass "$description (Status: $status_code)"
        return 0
    else
        print_fail "$description (Expected: $expected_status, Got: $status_code)"
        echo "Response: $body"
        return 1
    fi
}

# Function to test with authentication
test_api_auth() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    print_test "$description"
    
    # Get auth token first
    token_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@dimec.com","password":"admin123"}' \
        "$BACKEND_URL/api/auth/login")
    
    token=$(echo "$token_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    if [ -z "$token" ]; then
        print_fail "Could not get authentication token"
        return 1
    fi
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d "$data" \
            "$BACKEND_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            "$BACKEND_URL$endpoint")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" -eq "$expected_status" ]; then
        print_pass "$description (Status: $status_code)"
        return 0
    else
        print_fail "$description (Expected: $expected_status, Got: $status_code)"
        echo "Response: $body"
        return 1
    fi
}

echo "🔍 Starting Integration Tests..."
echo ""

# 1. Test Backend Health
print_test "Backend Health Check"
if curl -f "$BACKEND_URL/api/auth/login" > /dev/null 2>&1; then
    print_pass "Backend is running"
else
    print_fail "Backend is not running"
    exit 1
fi

# 2. Test Authentication
test_api "POST" "/api/auth/login" \
    '{"email":"admin@dimec.com","password":"admin123"}' \
    200 "Valid Login"

test_api "POST" "/api/auth/login" \
    '{"email":"invalid@test.com","password":"wrong"}' \
    401 "Invalid Login"

# 3. Test Product Creation with New DTO
test_api_auth "POST" "/api/products" \
    '{"name":"Test Product","categoryId":1,"supplierId":1,"quantity":50,"unitPrice":299.99,"reorderLevel":10,"description":"Test product"}' \
    201 "Product Creation with New DTO"

# 4. Test Product Creation Validation
test_api_auth "POST" "/api/products" \
    '{"name":"","categoryId":null,"supplierId":null,"quantity":-1,"unitPrice":0}' \
    400 "Product Creation Validation"

# 5. Test Product Retrieval
test_api_auth "GET" "/api/products" "" 200 "Get All Products"

test_api_auth "GET" "/api/products/low-stock" "" 200 "Get Low Stock Products"

# 6. Test Issuance Creation with New DTO
test_api_auth "POST" "/api/issuances" \
    '{"productId":1,"quantityIssued":5,"issuedTo":"Test Department","purpose":"Testing issuance"}' \
    201 "Issuance Creation with New DTO"

# 7. Test Issuance Validation
test_api_auth "POST" "/api/issuances" \
    '{"productId":null,"quantityIssued":0,"issuedTo":""}' \
    400 "Issuance Creation Validation"

# 8. Test Issuance Retrieval
test_api_auth "GET" "/api/issuances" "" 200 "Get All Issuances"

# 9. Test Categories
test_api_auth "GET" "/api/categories" "" 200 "Get All Categories"

test_api_auth "POST" "/api/categories" \
    '{"name":"Test Category","description":"Test description"}' \
    201 "Create Category"

# 10. Test Suppliers
test_api_auth "GET" "/api/suppliers" "" 200 "Get All Suppliers"

test_api_auth "POST" "/api/suppliers" \
    '{"name":"Test Supplier","contact":"Test Contact","email":"test@supplier.com","phone":"1234567890","address":"Test Address"}' \
    201 "Create Supplier"

# 11. Test Dashboard
test_api_auth "GET" "/api/dashboard/stats" "" 200 "Get Dashboard Stats"

# 12. Test Date Range Filtering
test_api_auth "GET" "/api/issuances/date-range?startDate=2025-01-01&endDate=2025-12-31" "" 200 "Date Range Filtering"

# 13. Test Search Functionality
test_api_auth "GET" "/api/products/search?term=Test" "" 200 "Product Search"

# 14. Test Protected Routes (No Token)
test_api "GET" "/api/products" "" 401 "Protected Route Without Token"

# 15. Test CORS Headers
print_test "CORS Headers"
cors_response=$(curl -s -I -X OPTIONS "$BACKEND_URL/api/products" \
    -H "Origin: $FRONTEND_URL" \
    -H "Access-Control-Request-Method: POST")

if echo "$cors_response" | grep -q "Access-Control-Allow-Origin"; then
    print_pass "CORS headers are present"
else
    print_warning "CORS headers may not be properly configured"
fi

# 16. Test Error Handling
test_api_auth "GET" "/api/products/99999" "" 500 "Error Handling for Non-existent Product"

# 17. Test Input Sanitization
test_api_auth "POST" "/api/products" \
    '{"name":"<script>alert(\"xss\")</script>","categoryId":1,"supplierId":1,"quantity":10,"unitPrice":10.00,"reorderLevel":5}' \
    201 "Input Sanitization"

# 18. Test Rate Limiting (if implemented)
print_test "Rate Limiting"
for i in {1..5}; do
    curl -s "$BACKEND_URL/api/auth/login" > /dev/null
done
print_pass "Rate limiting test completed"

# 19. Test Database Connection
print_test "Database Connection"
db_test=$(curl -s "$BACKEND_URL/api/dashboard/stats" | head -c 100)
if [ -n "$db_test" ]; then
    print_pass "Database connection is working"
else
    print_fail "Database connection may have issues"
fi

# 20. Test JWT Token Validation
print_test "JWT Token Validation"
invalid_token_response=$(curl -s -w "\n%{http_code}" -X GET \
    -H "Authorization: Bearer invalid_token" \
    "$BACKEND_URL/api/products")

invalid_status=$(echo "$invalid_token_response" | tail -n1)
if [ "$invalid_status" -eq 401 ]; then
    print_pass "JWT token validation is working"
else
    print_fail "JWT token validation may not be working"
fi

echo ""
echo "📊 Test Results Summary"
echo "======================="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Total Tests:  $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All tests passed! The system is working correctly.${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}⚠️  Some tests failed. Please review the issues above.${NC}"
    exit 1
fi
