# 🏗️ System Architecture Diagrams

## DIMEC Inventory Management System Architecture

### 1. Overall System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React UI Components]
        State[State Management]
        Router[React Router]
        API[API Client - Axios]
    end
    
    subgraph "Backend Layer"
        Controller[REST Controllers]
        Service[Business Services]
        Security[Spring Security]
        JWT[JWT Authentication]
    end
    
    subgraph "Data Layer"
        JPA[Spring Data JPA]
        Repo[Repository Layer]
        DB[(H2 Database)]
    end
    
    subgraph "External Services"
        H2Console[H2 Console]
        FileSystem[File System]
    end
    
    UI --> State
    State --> Router
    Router --> API
    API --> Controller
    Controller --> Service
    Service --> Security
    Security --> JWT
    Service --> JPA
    JPA --> Repo
    Repo --> DB
    DB --> H2Console
    Service --> FileSystem
    
    style UI fill:#e1f5fe
    style DB fill:#f3e5f5
    style Security fill:#fff3e0
```

### 2. Frontend Architecture

```mermaid
graph TB
    subgraph "Presentation Layer"
        Pages[Page Components]
        Layout[Layout Components]
        UI[UI Components - shadcn/ui]
    end
    
    subgraph "State Management"
        AuthContext[Authentication Context]
        AppContext[Application Context]
        LocalState[Component State]
    end
    
    subgraph "Services"
        API[API Services]
        Utils[Utility Functions]
        Constants[Constants]
    end
    
    subgraph "Routing"
        Router[React Router]
        ProtectedRoutes[Protected Routes]
        PublicRoutes[Public Routes]
    end
    
    Pages --> Layout
    Layout --> UI
    Pages --> AuthContext
    AuthContext --> AppContext
    AppContext --> LocalState
    Pages --> API
    API --> Utils
    Utils --> Constants
    Router --> ProtectedRoutes
    Router --> PublicRoutes
    
    style Pages fill:#e8f5e8
    style AuthContext fill:#fff2cc
    style API fill:#ffe6cc
```

### 3. Backend Architecture

```mermaid
graph TB
    subgraph "API Layer"
        AuthController[Auth Controller]
        ProductController[Product Controller]
        CategoryController[Category Controller]
        SupplierController[Supplier Controller]
        IssuanceController[Issuance Controller]
        DashboardController[Dashboard Controller]
    end
    
    subgraph "Service Layer"
        AuthService[Authentication Service]
        ProductService[Product Service]
        CategoryService[Category Service]
        SupplierService[Supplier Service]
        IssuanceService[Issuance Service]
        DashboardService[Dashboard Service]
    end
    
    subgraph "Security Layer"
        JWTFilter[JWT Authentication Filter]
        SecurityConfig[Security Configuration]
        JwtUtil[JWT Utility]
    end
    
    subgraph "Data Layer"
        UserRepo[User Repository]
        ProductRepo[Product Repository]
        CategoryRepo[Category Repository]
        SupplierRepo[Supplier Repository]
        IssuanceRepo[Issuance Repository]
    end
    
    subgraph "Database"
        H2DB[(H2 Database)]
        Console[H2 Console]
    end
    
    AuthController --> AuthService
    ProductController --> ProductService
    CategoryController --> CategoryService
    SupplierController --> SupplierService
    IssuanceController --> IssuanceService
    DashboardController --> DashboardService
    
    AuthService --> JWTFilter
    JWTFilter --> SecurityConfig
    SecurityConfig --> JwtUtil
    
    AuthService --> UserRepo
    ProductService --> ProductRepo
    CategoryService --> CategoryRepo
    SupplierService --> SupplierRepo
    IssuanceService --> IssuanceRepo
    
    UserRepo --> H2DB
    ProductRepo --> H2DB
    CategoryRepo --> H2DB
    SupplierRepo --> H2DB
    IssuanceRepo --> H2DB
    
    H2DB --> Console
    
    style AuthController fill:#ffcccc
    style ProductService fill:#ccffcc
    style JWTFilter fill:#ccccff
    style H2DB fill:#ffcc99
```

### 4. Data Flow Architecture

```mermaid
sequenceDiagram
    participant User as User
    participant Frontend as React Frontend
    participant API as Spring Boot API
    participant Security as Security Layer
    participant Service as Service Layer
    participant DB as H2 Database
    
    User->>Frontend: Login Request
    Frontend->>API: POST /api/auth/login
    API->>Security: Validate Credentials
    Security->>Service: Authenticate User
    Service->>DB: Find User by Email
    DB-->>Service: User Data
    Service-->>Security: Authentication Result
    Security-->>API: JWT Token
    API-->>Frontend: Login Response + Token
    Frontend-->>User: Dashboard
    
    User->>Frontend: View Products
    Frontend->>API: GET /api/products (with JWT)
    API->>Security: Validate JWT
    Security-->>API: User Context
    API->>Service: Get Products
    Service->>DB: Query Products
    DB-->>Service: Product List
    Service-->>API: Products with Business Logic
    API-->>Frontend: JSON Response
    Frontend-->>User: Product Table
```

### 5. Authentication Flow

```mermaid
flowchart TD
    Start([User Access]) --> Login{Login Page}
    Login --> Credentials[Enter Credentials]
    Credentials --> Submit[Submit Form]
    Submit --> API[POST /api/auth/login]
    API --> Validate[Validate Email/Password]
    Validate --> Valid{Valid?}
    Valid -->|Yes| Generate[Generate JWT Token]
    Valid -->|No| Error[Return Error]
    Generate --> Store[Store Token in localStorage]
    Store --> Redirect[Redirect to Dashboard]
    Redirect --> Protected[Access Protected Routes]
    
    Protected --> Check{Check Token}
    Check -->|Valid| Access[Grant Access]
    Check -->|Invalid/Expired| Logout[Clear Storage]
    Logout --> Login
    
    Error --> Login
    
    style Start fill:#e1f5fe
    style Valid fill:#c8e6c9
    style Error fill:#ffcdd2
    style Access fill:#fff3e0
```

### 6. Component Architecture

```mermaid
graph TB
    subgraph "Main Application"
        App[App.tsx]
        Router[App Router]
        AuthProvider[Authentication Provider]
    end
    
    subgraph "Layout Components"
        Navbar[Navbar Component]
        Sidebar[Sidebar Component]
        Footer[Footer Component]
    end
    
    subgraph "Page Components"
        Login[Login Page]
        Dashboard[Dashboard Page]
        Products[Products Page]
        Categories[Categories Page]
        Suppliers[Suppliers Page]
        Issuance[Issuance Page]
        Reports[Reports Page]
    end
    
    subgraph "Shared Components"
        DataTable[Data Table]
        FormModal[Form Modal]
        SearchBar[Search Bar]
        StatCard[Statistics Card]
        ExportButton[Export Button]
    end
    
    App --> Router
    Router --> AuthProvider
    AuthProvider --> Navbar
    Navbar --> Sidebar
    Sidebar --> Footer
    
    Router --> Login
    Router --> Dashboard
    Router --> Products
    Router --> Categories
    Router --> Suppliers
    Router --> Issuance
    Router --> Reports
    
    Products --> DataTable
    Products --> FormModal
    Products --> SearchBar
    Dashboard --> StatCard
    Reports --> ExportButton
    
    style App fill:#e3f2fd
    style AuthProvider fill:#f3e5f5
    style Dashboard fill:#e8f5e8
```

### 7. Database Architecture

```mermaid
erDiagram
    subgraph "Core Entities"
        USERS {
            bigint user_id PK
            varchar name
            varchar email UK
            varchar password
            varchar role
        }
        
        CATEGORIES {
            bigint category_id PK
            varchar name UK
            text description
        }
        
        SUPPLIERS {
            bigint supplier_id PK
            varchar name
            varchar contact
            varchar email
            text address
        }
        
        PRODUCTS {
            bigint product_id PK
            varchar name
            bigint category_id FK
            bigint supplier_id FK
            int quantity
            decimal unit_price
            int reorder_level
        }
        
        ISSUANCE_RECORDS {
            bigint issuance_id PK
            bigint product_id FK
            bigint user_id FK
            int quantity_issued
            varchar issued_to
            date issue_date
        }
    end
    
    USERS ||--o{ ISSUANCE_RECORDS : creates
    PRODUCTS ||--o{ ISSUANCE_RECORDS : issued_as
    CATEGORIES ||--o{ PRODUCTS : contains
    SUPPLIERS ||--o{ PRODUCTS : supplies
    
    style USERS fill:#ffeb3b
    style PRODUCTS fill:#4caf50
    style ISSUANCE_RECORDS fill:#2196f3
```

### 8. Security Architecture

```mermaid
graph TB
    subgraph "Client Side"
        TokenStorage[localStorage Token Storage]
        AuthContext[Authentication Context]
        ProtectedRoutes[Protected Route Components]
    end
    
    subgraph "Network Layer"
        HTTPRequests[HTTP Requests]
        JWTHeader[JWT Authorization Header]
        SSL[TLS/SSL Encryption]
    end
    
    subgraph "Server Security"
        JWTFilter[JWT Authentication Filter]
        SecurityConfig[Spring Security Config]
        RoleBasedAuth[Role-based Authorization]
    end
    
    subgraph "Data Security"
        PasswordHashing[BCrypt Password Hashing]
        InputValidation[Input Validation]
        SQLInjectionPrevention[JPA Parameterized Queries]
    end
    
    TokenStorage --> AuthContext
    AuthContext --> ProtectedRoutes
    ProtectedRoutes --> HTTPRequests
    HTTPRequests --> JWTHeader
    JWTHeader --> SSL
    SSL --> JWTFilter
    JWTFilter --> SecurityConfig
    SecurityConfig --> RoleBasedAuth
    RoleBasedAuth --> PasswordHashing
    PasswordHashing --> InputValidation
    InputValidation --> SQLInjectionPrevention
    
    style TokenStorage fill:#ffebee
    style JWTFilter fill:#e8f5e8
    style PasswordHashing fill:#fff3e0
```

### 9. Deployment Architecture

```mermaid
graph TB
    subgraph "Development Environment"
        DevLocal[Local Development]
        DevFrontend[Frontend: localhost:5173]
        DevBackend[Backend: localhost:8080]
        DevDB[H2 In-memory DB]
    end
    
    subgraph "Production Environment"
        ProdServer[Production Server]
        ProdFrontend[Frontend: Nginx/Apache]
        ProdBackend[Backend: Spring Boot JAR]
        ProdDB[Production Database]
        ProdSSL[SSL Certificate]
    end
    
    subgraph "Build Process"
        CodeSource[Source Code]
        FrontendBuild[Vite Build Process]
        BackendBuild[Maven Build Process]
        Artifacts[Build Artifacts]
    end
    
    DevLocal --> CodeSource
    CodeSource --> FrontendBuild
    CodeSource --> BackendBuild
    FrontendBuild --> Artifacts
    BackendBuild --> Artifacts
    Artifacts --> ProdServer
    ProdServer --> ProdFrontend
    ProdServer --> ProdBackend
    ProdBackend --> ProdDB
    ProdFrontend --> ProdSSL
    
    style DevLocal fill:#e1f5fe
    style ProdServer fill:#e8f5e8
    style Artifacts fill:#fff3e0
```

### 10. Technology Stack Integration

```mermaid
graph LR
    subgraph "Frontend Technologies"
        React[React 19]
        TypeScript[TypeScript]
        Vite[Vite]
        Tailwind[TailwindCSS]
        Shadcn[shadcn/ui]
        Axios[Axios]
    end
    
    subgraph "Backend Technologies"
        SpringBoot[Spring Boot 3.2]
        Security[Spring Security]
        JPA[Spring Data JPA]
        JWT[JWT Library]
        H2[H2 Database]
        Maven[Maven]
    end
    
    subgraph "Development Tools"
        Git[Git]
        ESLint[ESLint]
        Postman[Postman]
        H2Console[H2 Console]
    end
    
    React --> TypeScript
    TypeScript --> Vite
    Vite --> Tailwind
    Tailwind --> Shadcn
    Shadcn --> Axios
    
    Axios --> SpringBoot
    SpringBoot --> Security
    Security --> JPA
    JPA --> JWT
    JWT --> H2
    H2 --> Maven
    
    Maven --> Git
    Git --> ESLint
    ESLint --> Postman
    Postman --> H2Console
    
    style React fill:#61dafb
    style SpringBoot fill:#6db33f
    style H2 fill:#ff6b6b
```

---

## Architecture Design Decisions

### 1. **Three-Tier Architecture**
- **Presentation Layer**: React frontend with modern UI components
- **Business Logic Layer**: Spring Boot services with security
- **Data Access Layer**: JPA repositories with H2 database

### 2. **Component-Based Design**
- **Modular Components**: Reusable UI components
- **Service Layer**: Business logic separation
- **Repository Pattern**: Data access abstraction

### 3. **Security-First Approach**
- **JWT Authentication**: Stateless token-based auth
- **Role-Based Access**: Granular permission control
- **Input Validation**: Comprehensive data validation

### 4. **Performance Optimization**
- **Lazy Loading**: Efficient data fetching
- **Caching Strategy**: Appropriate caching layers
- **Database Indexing**: Optimized query performance

### 5. **Scalability Considerations**
- **Stateless Design**: Easy horizontal scaling
- **Microservice Ready**: Clear service boundaries
- **API-First**: RESTful design for client flexibility

---

**Architecture Created**: October 27, 2025  
**Design Patterns**: MVC, Repository, Service, JWT Authentication  
**Diagram Tools**: Mermaid (compatible with documentation)
