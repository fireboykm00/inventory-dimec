# 🧾 Inventory System for DIMEC INVESTMENTS Ltd (ISD)

**University of Lay Adventists of Kigali (UNILAK)**

**Faculty of Computing and Information Technology**

**Module:** MSIT6120 – Advanced Programming Concepts and Emerging Technologies

**FINAL PROJECT REPORT**

**Project Title:** Inventory System for DIMEC INVESTMENTS Ltd (ISD)**

**Submitted by:** GATETE Dieudonné (M04176/2025)

**Date:** October 2025

---

## **Abstract**

The **Inventory System for DIMEC INVESTMENTS (ISD)** is a web-based application developed to address real-world operational challenges in resource and stock management. The system automates the tracking of products, suppliers, and issuance records, providing real-time visibility into inventory movements across departments.

Developed using **Spring Boot (backend)**, **React + Vite + shadcn/ui (frontend)**, and **SQLite (database)**, this system demonstrates the application of modern full-stack development practices to streamline the business operations of a Rwandan ICT and equipment supply company — DIMEC INVESTMENTS Ltd.

---

## **Introduction**

**DIMEC INVESTMENTS Ltd** is a Rwandan-based technology and systems integration company specializing in ICT infrastructure, electronic equipment, and security systems. Like many growing enterprises, DIMEC faced challenges managing its internal stock, tracking issued materials, and maintaining visibility of supplier deliveries.

The **Inventory System for DIMEC INVESTMENTS** was developed as a **digital solution** to replace manual recordkeeping. It automates inventory registration, supplier management, and issuance tracking, helping the company improve operational efficiency and accountability.

---

## **Objectives**

- To design a centralized inventory management system for DIMEC INVESTMENTS.
- To track stock levels, supplier deliveries, and issued items accurately.
- To automate product registration, update, and reporting processes.
- To enhance accountability and transparency across departments.
- To generate analytics and reports on inventory usage and value.

---

## **System Description**

The **Inventory System** follows a **three-layer architecture** comprising the backend, frontend, and database layers.

1. **Backend (Spring Boot REST API):**
    - Manages CRUD operations for products, categories, suppliers, and issuance records.
    - Implements JWT-based authentication and role-based access control.
    - Uses **Spring Data JPA** with **SQLite** for persistence.
2. **Frontend (React + Vite + shadcn/ui):**
    - Provides intuitive dashboards for administrators and staff.
    - Displays inventory lists, supplier information, and issuance history.
    - Built using **TailwindCSS** and **shadcn/ui** for a professional look.
3. **Database (SQLite):**
    - Lightweight and file-based.
    - Stores all stock, supplier, and user information.
    - Automatically synchronized through JPA entity mappings.

**User Roles:**

- **Admin:** Manages users, suppliers, and reports.
- **Inventory Clerk:** Adds and edits product entries, records issuances.
- **Viewer/Staff:** Views stock levels and product availability.

---

## **System Design**

### **Entity Relationship Diagram (ERD)**

| Entity | Description |
| --- | --- |
| **User** | Authorized system users with roles and credentials |
| **Category** | Groups of items such as ICT, Security Equipment, Office Supplies |
| **Product** | Represents each inventory item |
| **Supplier** | Company vendors providing goods |
| **IssuanceRecord** | Logs items issued to departments or clients |

**Relationships:**

- Category → Product: **1–N**
- Supplier → Product: **1–N**
- Product → IssuanceRecord: **1–N**
- User → IssuanceRecord: **1–N**

🧩 *ERD created using dbdiagram.io (see Figure 1)*

**dbdiagram.io Code Example:**

```sql
Table User {
  user_id int [pk, increment]
  name varchar
  email varchar [unique]
  password varchar
  role varchar
}

Table Category {
  category_id int [pk, increment]
  name varchar
  description varchar
}

Table Supplier {
  supplier_id int [pk, increment]
  name varchar
  contact varchar
  email varchar
}

Table Product {
  product_id int [pk, increment]
  name varchar
  category_id int [ref: > Category.category_id]
  supplier_id int [ref: > Supplier.supplier_id]
  quantity int
  unit_price decimal
  reorder_level int
}

Table IssuanceRecord {
  issuance_id int [pk, increment]
  product_id int [ref: > Product.product_id]
  user_id int [ref: > User.user_id]
  quantity_issued int
  issued_to varchar
  issue_date date
}

Ref: Category.category_id < Product.category_id
Ref: Supplier.supplier_id < Product.supplier_id
Ref: Product.product_id < IssuanceRecord.product_id
Ref: User.user_id < IssuanceRecord.user_id

```

---

### **System Architecture Diagram**

```
[React + Vite + shadcn/ui Frontend]
       │  (Axios API Calls)
       ▼
[Spring Boot REST API]
       │  (Spring Data JPA)
       ▼
[SQLite Database]

```

🧩 *Architecture diagram designed using draw.io (see Figure 2)*

---

## **Implementation**

### **Backend (Spring Boot)**

**Structure:**

```
com.dimec.inventory
 ├── controller/
 ├── service/
 ├── repository/
 ├── model/
 ├── config/
 └── dto/

```

**Key Features:**

- CRUD operations for products, suppliers, categories, and issuance records.
- JWT authentication and role-based authorization.
- Automatic stock update after issuance.
- Scheduler for low-stock and reorder-level alerts.

**Core Endpoints:**

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/login` | Authenticate user & return JWT |
| GET | `/api/products` | List all products |
| POST | `/api/products` | Add new product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |
| GET | `/api/suppliers` | Manage supplier list |
| POST | `/api/issuances` | Record issued product |
| GET | `/api/reports/reorder` | Reorder-level report |

**Technologies:**

- Spring Boot 3.x
- Spring Security + JWT
- Spring Data JPA
- SQLite JDBC
- Lombok

---

### **Frontend (React + Vite + shadcn/ui)**

**Pages:**

- `Login.jsx` — Login page for all users.
- `Dashboard.jsx` — Overview of stock levels and low-stock alerts.
- `Products.jsx` — CRUD interface for product management.
- `Suppliers.jsx` — Supplier data management.
- `Issuance.jsx` — Record issued products.
- `Reports.jsx` — Generate reorder and issuance summaries.

**Frontend Tools:**

- **React Router** — Navigation.
- **Axios** — API communication.
- **shadcn/ui** — Components (`Card`, `Button`, `Dialog`, `Table`).
- **TailwindCSS** — Styling.
- **Chart.js** — Visualize stock and issuance trends.

**State Management:**

`useState`, `useEffect`, and `useContext` (lightweight only).

---

### **Database (SQLite)**

**Configuration:**

```
spring.datasource.url=jdbc:sqlite:dimec_inventory.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.SQLiteDialect

```

**Tables:**

- users
- categories
- suppliers
- products
- issuance_records

All managed automatically by Hibernate.

---

## **Testing**

**Backend:**

- Verified all CRUD and auth endpoints with Postman.
- Tested issuance logic for reducing stock quantity.

**Frontend:**

- Browser testing of dashboard, tables, and forms.
- Confirmed token-based login protection.

**Integration:**

- Tested React ↔ Spring Boot communication through Axios.

📸 *Screenshots attached:*

- Spring Boot console output
- Postman tests
- React dashboard view with stock tables

---

## **Challenges and Solutions**

| Challenge | Solution |
| --- | --- |
| SQLite locking during concurrent access | Used connection pool and transaction isolation |
| React routing issues with Vite | Configured BrowserRouter and fallback routes |
| JWT header misconfiguration | Fixed Axios interceptor setup |
| Styling inconsistency | Unified UI using shadcn/ui components |

---

## **Conclusion and Recommendations**

The **Inventory System for DIMEC INVESTMENTS Ltd** effectively demonstrates the use of modern software engineering practices to address real business challenges. It provides transparency, automation, and accountability in managing inventory resources.

**Future Enhancements:**

- Integration with QR/barcode scanners for faster stock entry.
- Exportable PDF and Excel reports.
- Cloud-based multi-branch synchronization.

---

## 

---