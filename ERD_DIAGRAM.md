# 🗄️ Entity Relationship Diagram (ERD)

## Database Design for DIMEC Inventory Management System

### ERD Diagram (Mermaid Format)

```mermaid
erDiagram
    USERS {
        bigint user_id PK "Primary Key, Auto-generated"
        varchar name "User's full name"
        varchar email UK "Unique email for login"
        varchar password "BCrypt hashed password"
        varchar role "ADMIN, INVENTORY_CLERK, VIEWER"
        timestamp created_at "Account creation timestamp"
        timestamp updated_at "Last update timestamp"
    }
    
    CATEGORIES {
        bigint category_id PK "Primary Key, Auto-generated"
        varchar name UK "Unique category name"
        text description "Category description"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
    }
    
    SUPPLIERS {
        bigint supplier_id PK "Primary Key, Auto-generated"
        varchar name "Supplier company name"
        varchar contact "Contact person name"
        varchar email "Supplier email"
        varchar phone "Phone number"
        text address "Physical address"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
    }
    
    PRODUCTS {
        bigint product_id PK "Primary Key, Auto-generated"
        varchar name "Product name"
        text description "Product description"
        bigint category_id FK "References CATEGORIES"
        bigint supplier_id FK "References SUPPLIERS"
        int quantity "Current stock quantity"
        decimal unit_price "Price per unit"
        int reorder_level "Alert threshold"
        varchar sku "Stock keeping unit"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
    }
    
    ISSUANCE_RECORDS {
        bigint issuance_id PK "Primary Key, Auto-generated"
        bigint product_id FK "References PRODUCTS"
        bigint user_id FK "References USERS"
        int quantity_issued "Number of items issued"
        varchar issued_to "Department/Person receiving"
        date issue_date "Date of issuance"
        text purpose "Purpose of issuance"
        varchar status "PENDING, APPROVED, COMPLETED"
        timestamp created_at "Record creation timestamp"
        timestamp updated_at "Last update timestamp"
    }
    
    %% Relationships
    USERS ||--o{ ISSUANCE_RECORDS : "issues"
    USERS ||--o{ ISSUANCE_RECORDS : "approves"
    PRODUCTS ||--o{ ISSUANCE_RECORDS : "issued_as"
    CATEGORIES ||--o{ PRODUCTS : "contains"
    SUPPLIERS ||--o{ PRODUCTS : "supplies"
    
    %% Relationship Details
    USERS {
        + user_id
        + name
        + email
        + password
        + role
        + created_at
        + updated_at
    }
    
    CATEGORIES {
        + category_id
        + name
        + description
        + created_at
        + updated_at
    }
    
    SUPPLIERS {
        + supplier_id
        + name
        + contact
        + email
        + phone
        + address
        + created_at
        + updated_at
    }
    
    PRODUCTS {
        + product_id
        + name
        + description
        + category_id
        + supplier_id
        + quantity
        + unit_price
        + reorder_level
        + sku
        + created_at
        + updated_at
    }
    
    ISSUANCE_RECORDS {
        + issuance_id
        + product_id
        + user_id
        + quantity_issued
        + issued_to
        + issue_date
        + purpose
        + status
        + created_at
        + updated_at
    }
```

## Database Schema Details

### 1. USERS Table

**Purpose**: Stores system user information and authentication credentials

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| name | VARCHAR(100) | NOT NULL | User's full name |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Login email |
| password | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| role | VARCHAR(20) | NOT NULL | User role (ADMIN, INVENTORY_CLERK, VIEWER) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Business Rules**:
- Email must be unique across all users
- Password is hashed using BCrypt with strength 10
- Role determines system access permissions
- Admin can manage all system data
- Inventory Clerk can manage products and issuances
- Viewer has read-only access

### 2. CATEGORIES Table

**Purpose**: Organizes products into logical groups

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| category_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Category name |
| description | TEXT | NULL | Detailed description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Business Rules**:
- Category names must be unique
- Categories help organize products for better management
- Examples: ICT Equipment, Security Systems, Office Supplies

### 3. SUPPLIERS Table

**Purpose**: Maintains vendor information for procurement

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| supplier_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| name | VARCHAR(100) | NOT NULL | Company name |
| contact | VARCHAR(100) | NULL | Contact person |
| email | VARCHAR(100) | NULL | Supplier email |
| phone | VARCHAR(20) | NULL | Phone number |
| address | TEXT | NULL | Physical address |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Business Rules**:
- Each product is associated with one supplier
- Supplier information helps with procurement and reordering
- Contact details facilitate communication

### 4. PRODUCTS Table

**Purpose**: Core inventory item tracking and management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| product_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| name | VARCHAR(100) | NOT NULL | Product name |
| description | TEXT | NULL | Product description |
| category_id | BIGINT | FOREIGN KEY → CATEGORIES | Product category |
| supplier_id | BIGINT | FOREIGN KEY → SUPPLIERS | Primary supplier |
| quantity | INT | NOT NULL, DEFAULT 0 | Current stock |
| unit_price | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 | Price per unit |
| reorder_level | INT | NOT NULL, DEFAULT 5 | Alert threshold |
| sku | VARCHAR(50) | UNIQUE | Stock keeping unit |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Business Rules**:
- Quantity cannot be negative
- Unit price must be positive
- Low stock alert when quantity ≤ reorder_level
- SKU must be unique for product identification
- Each product belongs to exactly one category and supplier

### 5. ISSUANCE_RECORDS Table

**Purpose**: Tracks product distribution and maintains audit trail

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| issuance_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| product_id | BIGINT | FOREIGN KEY → PRODUCTS | Issued product |
| user_id | BIGINT | FOREIGN KEY → USERS | Who issued |
| quantity_issued | INT | NOT NULL | Amount issued |
| issued_to | VARCHAR(100) | NOT NULL | Recipient |
| issue_date | DATE | NOT NULL | Date of issuance |
| purpose | TEXT | NULL | Purpose description |
| status | VARCHAR(20) | DEFAULT 'COMPLETED' | Issuance status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Business Rules**:
- Cannot issue more than available quantity
- Each issuance reduces product stock
- Complete audit trail maintained
- Status tracks approval workflow
- Issue date defaults to current date

## Relationship Cardinalities

### One-to-Many Relationships

1. **CATEGORIES → PRODUCTS** (1:N)
   - One category can contain many products
   - Each product belongs to exactly one category

2. **SUPPLIERS → PRODUCTS** (1:N)
   - One supplier can provide many products
   - Each product has exactly one primary supplier

3. **USERS → ISSUANCE_RECORDS** (1:N)
   - One user can create many issuance records
   - Each issuance record is created by exactly one user

4. **PRODUCTS → ISSUANCE_RECORDS** (1:N)
   - One product can be issued many times
   - Each issuance record involves exactly one product

## Database Constraints and Indexes

### Primary Keys
- All tables have auto-incrementing BIGINT primary keys
- Ensures unique identification of each record

### Foreign Keys
- Enforce referential integrity
- Prevent orphaned records
- Enable cascading operations where appropriate

### Unique Constraints
- `users.email` - Prevents duplicate user accounts
- `categories.name` - Prevents duplicate categories
- `products.sku` - Prevents duplicate product codes

### Indexes for Performance
```sql
-- Optimized for common queries
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_low_stock ON products(quantity, reorder_level);
CREATE INDEX idx_issuances_product ON issuance_records(product_id);
CREATE INDEX idx_issuances_user ON issuance_records(user_id);
CREATE INDEX idx_issuances_date ON issuance_records(issue_date);
```

## Data Integrity Rules

### Business Logic Constraints
1. **Stock Validation**: Product quantity cannot go negative
2. **Issuance Validation**: Cannot issue more than available stock
3. **Price Validation**: Unit price must be positive
4. **Role Validation**: User roles must be predefined values
5. **Email Validation**: Email format must be valid

### Trigger Logic (Implemented in Service Layer)
1. **Stock Update**: Automatically reduce product quantity on issuance
2. **Low Stock Alert**: Flag products below reorder level
3. **Audit Trail**: Track all data modifications
4. **Timestamp Management**: Automatically update created_at/updated_at

## Sample Data Relationships

```
ADMIN USER (user_id: 1)
├── Creates ISSUANCE_RECORDS
│   ├── issuance_id: 101 → PRODUCT: Laptop (product_id: 1)
│   └── issuance_id: 102 → PRODUCT: Camera (product_id: 4)
└── Manages CATEGORIES
    ├── category_id: 1 (ICT Equipment) → PRODUCTS: Laptop, Desktop, Printer
    ├── category_id: 2 (Security Systems) → PRODUCTS: Camera, DVR
    └── category_id: 3 (Office Supplies) → PRODUCTS: Chair, Desk

SUPPLIERS
├── Tech Solutions Ltd (supplier_id: 1) → ICT Products
├── Secure Systems Co (supplier_id: 2) → Security Products
└── Office Depot Rwanda (supplier_id: 3) → Office Products
```

## Database Normalization

### Normal Forms Achieved
- **1NF**: All atomic values, no repeating groups
- **2NF**: No partial dependencies on composite keys
- **3NF**: No transitive dependencies

### Denormalization Considerations
- Added `category_name` and `supplier_name` in DTOs for performance
- Computed `low_stock` flag for UI efficiency
- These are calculated in service layer, not stored

## ERD Design Decisions

### Why This Design?
1. **Scalability**: Clear separation allows easy expansion
2. **Performance**: Proper indexing ensures fast queries
3. **Integrity**: Foreign keys maintain data consistency
4. **Auditability**: Complete history tracking
5. **Flexibility**: Easy to add new attributes and relationships

### Alternative Designs Considered
1. **Single Table Inheritance**: Rejected for complexity
2. **Many-to-Many Product-Supplier**: Rejected (simplified to one supplier)
3. **Separate Stock Table**: Rejected (integrated into products)

### Future Expansion Points
1. **Purchase Orders**: New table linked to suppliers
2. **Inventory Adjustments**: New table for stock corrections
3. **Departments**: New table for issued_to normalization
4. **Product Images**: New table for product photos
5. **Price History**: New table for price tracking

---

**ERD Created**: October 27, 2025  
**Database**: H2 (In-memory)  
**ORM**: Spring Data JPA  
**Diagram Tool**: Mermaid (compatible with GitHub/Markdown)
