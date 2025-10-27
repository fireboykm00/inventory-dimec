package com.dimec.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {
    
    @NotBlank(message = "Product name is required")
    private String name;
    
    @NotNull(message = "Category is required")
    private Long categoryId;
    
    @NotNull(message = "Supplier is required")
    private Long supplierId;
    
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity = 0;
    
    @NotNull(message = "Unit price is required")
    private BigDecimal unitPrice;
    
    @Min(value = 0, message = "Reorder level cannot be negative")
    private Integer reorderLevel = 10;
    
    private String description;
}
