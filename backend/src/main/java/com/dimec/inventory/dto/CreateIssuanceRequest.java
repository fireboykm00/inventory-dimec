package com.dimec.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateIssuanceRequest {
    
    @NotNull(message = "Product is required")
    private Long productId;
    
    @Min(value = 1, message = "Quantity issued must be at least 1")
    private Integer quantityIssued;
    
    @NotBlank(message = "Issued to is required")
    private String issuedTo;
    
    private String purpose;
}
