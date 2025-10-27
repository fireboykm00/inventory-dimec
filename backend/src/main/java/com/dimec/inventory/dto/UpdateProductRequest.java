package com.dimec.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductRequest {
    
    @NotBlank(message = "Product name is required")
    private String name;
    
    private Long categoryId;
    
    private Long supplierId;
    
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;
    
    private BigDecimal unitPrice;
    
    @Min(value = 0, message = "Reorder level cannot be negative")
    private Integer reorderLevel;
    
    private String description;
}
