package com.dimec.inventory.service;

import com.dimec.inventory.dto.DashboardStats;
import com.dimec.inventory.model.Product;
import com.dimec.inventory.repository.CategoryRepository;
import com.dimec.inventory.repository.IssuanceRecordRepository;
import com.dimec.inventory.repository.ProductRepository;
import com.dimec.inventory.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private SupplierRepository supplierRepository;
    
    @Autowired
    private IssuanceRecordRepository issuanceRecordRepository;
    
    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        
        stats.setTotalProducts(productRepository.count());
        stats.setTotalCategories(categoryRepository.count());
        stats.setTotalSuppliers(supplierRepository.count());
        stats.setLowStockProducts((long) productRepository.findLowStockProducts().size());
        stats.setTotalIssuances(issuanceRecordRepository.count());
        
        // Calculate total inventory value
        List<Product> products = productRepository.findAll();
        BigDecimal totalValue = products.stream()
                .map(p -> p.getUnitPrice().multiply(BigDecimal.valueOf(p.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalInventoryValue(totalValue);
        
        return stats;
    }
}
