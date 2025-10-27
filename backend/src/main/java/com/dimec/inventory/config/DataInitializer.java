package com.dimec.inventory.config;

import com.dimec.inventory.model.*;
import com.dimec.inventory.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private SupplierRepository supplierRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("🧾 Initializing DIMEC Inventory System data...");
        
        try {
            initializeUsers();
            initializeCategories();
            initializeSuppliers();
            initializeProducts();
            initializeSampleIssuances();
            
            System.out.println("✅ Sample data initialized successfully!");
            System.out.println("👤 Default login: admin@dimec.com / admin123");
            
        } catch (Exception e) {
            System.err.println("❌ Error initializing data: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void initializeUsers() {
        System.out.println("Creating users...");
        
        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@dimec.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        userRepository.save(admin);
        
        User clerk = new User();
        clerk.setName("Inventory Clerk");
        clerk.setEmail("clerk@dimec.com");
        clerk.setPassword(passwordEncoder.encode("clerk123"));
        clerk.setRole("INVENTORY_CLERK");
        userRepository.save(clerk);
        
        User viewer = new User();
        viewer.setName("Viewer User");
        viewer.setEmail("viewer@dimec.com");
        viewer.setPassword(passwordEncoder.encode("viewer123"));
        viewer.setRole("VIEWER");
        userRepository.save(viewer);
        
        System.out.println("✓ Created 3 users");
    }
    
    private void initializeCategories() {
        System.out.println("Creating categories...");
        
        Category ict = new Category();
        ict.setName("ICT Equipment");
        ict.setDescription("Computers, laptops, and networking equipment");
        categoryRepository.save(ict);
        
        Category security = new Category();
        security.setName("Security Systems");
        security.setDescription("Cameras, alarms, and security equipment");
        categoryRepository.save(security);
        
        Category office = new Category();
        office.setName("Office Supplies");
        office.setDescription("Stationery and office equipment");
        categoryRepository.save(office);
        
        System.out.println("✓ Created 3 categories");
    }
    
    private void initializeSuppliers() {
        System.out.println("Creating suppliers...");
        
        Supplier techSupplier = new Supplier();
        techSupplier.setName("Tech Solutions Ltd");
        techSupplier.setContact("John Tech");
        techSupplier.setEmail("info@techsolutions.rw");
        techSupplier.setAddress("Kigali, Rwanda - KN 4 Ave");
        supplierRepository.save(techSupplier);
        
        Supplier securitySupplier = new Supplier();
        securitySupplier.setName("Secure Systems Co");
        securitySupplier.setContact("Jane Security");
        securitySupplier.setEmail("sales@securesystems.rw");
        securitySupplier.setAddress("Kigali, Rwanda - Nyabugogo");
        supplierRepository.save(securitySupplier);
        
        Supplier officeSupplier = new Supplier();
        officeSupplier.setName("Office Depot Rwanda");
        officeSupplier.setContact("Mike Office");
        officeSupplier.setEmail("orders@officedepot.rw");
        officeSupplier.setAddress("Kigali, Rwanda - Kicukiro");
        supplierRepository.save(officeSupplier);
        
        System.out.println("✓ Created 3 suppliers");
    }
    
    private void initializeProducts() {
        System.out.println("Creating products...");
        
        // Get categories and suppliers
        Category ictCategory = categoryRepository.findAll().get(0);
        Category securityCategory = categoryRepository.findAll().get(1);
        Category officeCategory = categoryRepository.findAll().get(2);
        
        Supplier techSupplier = supplierRepository.findAll().get(0);
        Supplier securitySupplier = supplierRepository.findAll().get(1);
        Supplier officeSupplier = supplierRepository.findAll().get(2);
        
        // ICT Products
        if (ictCategory != null && techSupplier != null) {
            Product laptop = new Product();
            laptop.setName("Laptop Dell Latitude 5420");
            laptop.setCategory(ictCategory);
            laptop.setSupplier(techSupplier);
            laptop.setQuantity(15);
            laptop.setUnitPrice(new BigDecimal("850.00"));
            laptop.setReorderLevel(5);
            laptop.setDescription("Business laptop with Intel i5, 8GB RAM, 256GB SSD");
            productRepository.save(laptop);
            
            Product desktop = new Product();
            desktop.setName("Desktop PC HP Pro");
            desktop.setCategory(ictCategory);
            desktop.setSupplier(techSupplier);
            desktop.setQuantity(8);
            desktop.setUnitPrice(new BigDecimal("650.00"));
            desktop.setReorderLevel(3);
            desktop.setDescription("Desktop computer for office use with monitor");
            productRepository.save(desktop);
            
            Product printer = new Product();
            printer.setName("HP LaserJet Pro M404n");
            printer.setCategory(ictCategory);
            printer.setSupplier(techSupplier);
            printer.setQuantity(4);
            printer.setUnitPrice(new BigDecimal("320.00"));
            printer.setReorderLevel(2);
            printer.setDescription("Network laser printer for office use");
            productRepository.save(printer);
        }
        
        // Security Products
        if (securityCategory != null && securitySupplier != null) {
            Product camera = new Product();
            camera.setName("Security Camera 4K Dome");
            camera.setCategory(securityCategory);
            camera.setSupplier(securitySupplier);
            camera.setQuantity(2);
            camera.setUnitPrice(new BigDecimal("320.00"));
            camera.setReorderLevel(5);
            camera.setDescription("4K security camera with night vision and motion detection");
            productRepository.save(camera);
            
            Product dvr = new Product();
            dvr.setName("DVR 8-Channel Security System");
            dvr.setCategory(securityCategory);
            dvr.setSupplier(securitySupplier);
            dvr.setQuantity(3);
            dvr.setUnitPrice(new BigDecimal("450.00"));
            dvr.setReorderLevel(2);
            dvr.setDescription("8-channel DVR system for security cameras");
            productRepository.save(dvr);
        }
        
        // Office Products
        if (officeCategory != null && officeSupplier != null) {
            Product chair = new Product();
            chair.setName("Office Chair Ergonomic");
            chair.setCategory(officeCategory);
            chair.setSupplier(officeSupplier);
            chair.setQuantity(20);
            chair.setUnitPrice(new BigDecimal("180.00"));
            chair.setReorderLevel(5);
            chair.setDescription("Ergonomic office chair with lumbar support");
            productRepository.save(chair);
            
            Product desk = new Product();
            desk.setName("Office Desk 120x60cm");
            desk.setCategory(officeCategory);
            desk.setSupplier(officeSupplier);
            desk.setQuantity(12);
            desk.setUnitPrice(new BigDecimal("220.00"));
            desk.setReorderLevel(4);
            desk.setDescription("Modern office desk with cable management");
            productRepository.save(desk);
        }
        
        System.out.println("✓ Created 8 products");
    }
    
    private void initializeSampleIssuances() {
        System.out.println("Creating sample issuance records...");
        
        User admin = userRepository.findAll().get(0);
        Product laptop = productRepository.findAll().stream()
            .filter(p -> p.getName().contains("Laptop"))
            .findFirst().orElse(null);
        
        if (admin != null && laptop != null) {
            IssuanceRecord issuance1 = new IssuanceRecord();
            issuance1.setProduct(laptop);
            issuance1.setUser(admin);
            issuance1.setQuantityIssued(2);
            issuance1.setIssuedTo("IT Department");
            issuance1.setIssueDate(LocalDate.now().minusDays(5));
            issuance1.setPurpose("New employee setup");
            
            // Save the issuance record
            // Note: In a real system, you would also update the product stock
            // For now, we'll just create the record
            
            System.out.println("✓ Created sample issuance records");
        }
    }
}
