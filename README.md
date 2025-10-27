# 🧾 DIMEC Inventory Management System

**University of Lay Adventists of Kigali (UNILAK)**  
**MSIT6120 – Advanced Programming Concepts and Emerging Technologies**  
**Final Project by GATETE Dieudonné (M04176/2025)**

A comprehensive web-based inventory management system designed for DIMEC INVESTMENTS Ltd, a Rwandan ICT and equipment supply company.

## 🎯 Project Overview

The DIMEC Inventory System automates the tracking of products, suppliers, and issuance records, providing real-time visibility into inventory movements across departments. This system replaces manual recordkeeping with a digital solution that enhances operational efficiency and accountability.

## 🏗️ System Architecture

### Technology Stack

**Backend:**
- **Spring Boot 3.2.0** - REST API framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Data persistence
- **H2 Database** - In-memory database with console
- **JWT** - Token-based authentication
- **Maven** - Build tool
- **Java 17** - Programming language

**Frontend:**
- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **TypeScript** - Type safety
- **shadcn/ui** - Component library
- **TailwindCSS** - Styling (Green theme)
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Sonner** - Toast notifications

## 📊 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Inventory Clerk, Viewer)
- Secure password hashing with BCrypt

### 📦 Product Management
- Full CRUD operations for products
- Real-time stock tracking
- Low stock alerts with reorder levels
- Product categorization
- Supplier management
- Search and filter functionality

### 🏷️ Category Management
- Create and manage product categories
- Organize products by type (ICT, Security, Office Supplies)

### 👥 Supplier Management
- Supplier information management
- Contact details and addresses
- Link suppliers to products

### 📋 Issuance Tracking
- Record product issuance to departments
- Automatic stock reduction
- Issuance history and reporting
- Purpose tracking

### 📈 Dashboard & Analytics
- Real-time inventory statistics
- Low stock alerts
- Total inventory value calculation
- Recent activity tracking

### 📊 Reporting
- Export inventory reports to CSV
- Low stock reports
- Issuance history reports
- Date-range filtering

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- pnpm package manager
- Maven 3.6+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inventory-dimec
   ```

2. **Backend Setup**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

3. **Frontend Setup**
   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```
   The frontend will start on `http://localhost:5173`

## 📁 Project Structure

```
inventory-dimec/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/dimec/inventory/
│   │   ├── controller/         # REST API endpoints
│   │   ├── service/           # Business logic
│   │   ├── repository/        # Data access layer
│   │   ├── model/             # Entity classes
│   │   ├── dto/               # Data transfer objects
│   │   ├── config/            # Security & configuration
│   │   └── exception/         # Exception handlers
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React contexts
│   │   ├── lib/              # Utilities and API
│   │   └── components/ui/    # shadcn/ui components
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/low-stock` - Get low stock products
- `GET /api/products/search?term={term}` - Search products

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
- `GET /api/issuances/date-range` - Get issuances by date range

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 👥 User Roles & Permissions

### **ADMIN**
- Full system access
- User management
- All CRUD operations
- Report generation

### **INVENTORY_CLERK**
- Product and supplier management
- Issuance recording
- Report generation
- Cannot manage users

### **VIEWER**
- View-only access
- Dashboard and reports
- Cannot modify data

## 🎨 UI Features

- **Green Theme** - Professional green color scheme
- **Responsive Design** - Works on desktop and mobile
- **Modern Components** - Built with shadcn/ui
- **Real-time Updates** - Live stock tracking
- **Interactive Dashboard** - Visual statistics
- **Search & Filter** - Easy data navigation
- **Export Functionality** - CSV report downloads

## 🗄️ Database Schema

### H2 Database Console
The system includes an H2 database console for direct database access:
- **URL**: http://localhost:8080/api/h2-console
- **JDBC URL**: `jdbc:h2:mem:dimec_inventory`
- **Username**: `sa`
- **Password**: (leave empty)

### Entities
- **Users** - System users with roles
- **Categories** - Product categorization
- **Suppliers** - Vendor information
- **Products** - Inventory items
- **IssuanceRecords** - Item issuance tracking

### Relationships
- Category → Products (1:N)
- Supplier → Products (1:N)
- Product → IssuanceRecords (1:N)
- User → IssuanceRecords (1:N)

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
pnpm test
```

## 📝 Usage Examples

### 1. Login to the System
1. Navigate to `http://localhost:5173`
2. Register a new account or login with existing credentials
3. Select appropriate role (Admin, Inventory Clerk, or Viewer)

### 2. Add a Product
1. Go to Products page
2. Click "Add Product"
3. Fill in product details (name, category, supplier, quantity, price)
4. Save the product

### 3. Record Issuance
1. Navigate to Issuance page
2. Click "Record Issuance"
3. Select product, quantity, and recipient
4. Add purpose (optional)
5. Stock is automatically updated

### 4. Generate Reports
1. Go to Reports page
2. Choose report type (Inventory, Low Stock, Issuance)
3. Apply date filters if needed
4. Export to CSV

## 🔧 Configuration

### Backend Configuration (`application.properties`)
- Database: H2 In-memory (`dimec_inventory`)
- Server Port: 8080
- JWT Expiration: 24 hours
- CORS: Frontend origins allowed
- H2 Console: Available at `/h2-console`

### Frontend Configuration
- API Base URL: `http://localhost:8080/api`
- Development Server: `http://localhost:5173`
- Build Output: `dist/`

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
mvn clean package
java -jar target/inventory-1.0.0.jar
```

### Frontend Deployment
```bash
cd frontend
pnpm build
# Deploy dist/ folder to web server
```

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Check Java version (requires Java 17+)
   - Verify Maven installation
   - Check port 8080 availability

2. **Frontend build errors**
   - Ensure pnpm is installed
   - Check Node.js version (requires 18+)
   - Clear node_modules and reinstall

3. **Database connection issues**
   - Verify SQLite JDBC driver
   - Check file permissions for database file
   - Review application.properties

4. **CORS errors**
   - Verify frontend URL in CORS configuration
   - Check API base URL in frontend

## 📈 Performance Considerations

- Database connection pooling configured
- Lazy loading for entity relationships
- Frontend code splitting with Vite
- Optimized React rendering with hooks
- Efficient API response handling

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with BCrypt
- CORS configuration
- Input validation with Jakarta Bean Validation
- SQL injection prevention with JPA
- XSS protection headers

## 📞 Support

For technical support or questions:
- **Developer:** GATETE Dieudonné
- **Email:** [student-email@unilak.rw]
- **Student ID:** M04176/2025
- **University:** University of Lay Adventists of Kigali (UNILAK)

## 📄 License

This project is developed as part of academic coursework at UNILAK.

---

**© 2025 - University of Lay Adventists of Kigali**  
**MSIT6120 – Advanced Programming Concepts and Emerging Technologies**
