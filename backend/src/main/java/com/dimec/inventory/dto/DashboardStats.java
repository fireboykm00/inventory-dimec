package com.dimec.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private Long totalProducts;
    private Long totalCategories;
    private Long totalSuppliers;
    private Long lowStockProducts;
    private BigDecimal totalInventoryValue;
    private Long totalIssuances;
}
