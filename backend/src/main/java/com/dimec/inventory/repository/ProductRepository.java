package com.dimec.inventory.repository;

import com.dimec.inventory.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory_CategoryId(Long categoryId);
    List<Product> findBySupplier_SupplierId(Long supplierId);
    
    @Query("SELECT p FROM Product p WHERE p.quantity <= p.reorderLevel")
    List<Product> findLowStockProducts();
    
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Product> searchByName(String searchTerm);
}
