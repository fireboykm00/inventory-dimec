package com.dimec.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;
    private String name;
    private Long categoryId;
    private String categoryName;
    private Long supplierId;
    private String supplierName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private Integer reorderLevel;
    private String description;
    private boolean lowStock;
}
