package com.dimec.inventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "issuance_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssuanceRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "issuance_id")
    private Long issuanceId;
    
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull(message = "Product is required")
    private Product product;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;
    
    @Min(value = 1, message = "Quantity issued must be at least 1")
    @Column(nullable = false)
    private Integer quantityIssued;
    
    @NotBlank(message = "Issued to is required")
    @Column(nullable = false)
    private String issuedTo;
    
    @NotNull(message = "Issue date is required")
    @Column(nullable = false)
    private LocalDate issueDate;
    
    @Column(length = 500)
    private String purpose;
}
