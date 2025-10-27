# DIMEC Inventory System - Backend

Spring Boot REST API for the DIMEC INVESTMENTS Ltd Inventory Management System.

## Tech Stack

- **Spring Boot 3.2.0**
- **Spring Security** with JWT Authentication
- **Spring Data JPA** with Hibernate
- **SQLite** Database
- **Maven** Build Tool
- **Java 17**

## Project Structure

```
com.dimec.inventory
├── controller/      # REST API endpoints
├── service/         # Business logic
├── repository/      # Data access layer
├── model/          # Entity classes
├── dto/            # Data Transfer Objects
├── config/         # Security & JWT configuration
└── exception/      # Exception handlers
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/low-stock` - Get low stock products
- `GET /api/products/search?term={term}` - Search products
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Suppliers
- `GET /api/suppliers` - List all suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/{id}` - Update supplier
- `DELETE /api/suppliers/{id}` - Delete supplier

### Issuances
- `GET /api/issuances` - List all issuances
- `POST /api/issuances` - Create issuance record
- `DELETE /api/issuances/{id}` - Delete issuance

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Running the Application

### Prerequisites
- Java 17 or higher
- Maven 3.6+

### Build and Run

```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The server will start on `http://localhost:8080`

## Database

The application uses SQLite with the database file `dimec_inventory.db` created automatically in the project root.

## Default Configuration

- **Server Port:** 8080
- **Context Path:** /api
- **JWT Expiration:** 24 hours
- **CORS Allowed Origins:** http://localhost:5173, http://localhost:3000

## User Roles

- **ADMIN** - Full system access
- **INVENTORY_CLERK** - Manage products and issuances
- **VIEWER** - View-only access

## Testing

Run tests with:
```bash
mvn test
```

## Author

GATETE Dieudonné - UNILAK M04176/2025
