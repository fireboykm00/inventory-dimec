package com.dimec.inventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;
    
    @NotBlank(message = "Product name is required")
    @Column(nullable = false)
    private String name;
    
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @NotNull(message = "Category is required")
    private Category category;
    
    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    @NotNull(message = "Supplier is required")
    private Supplier supplier;
    
    @Min(value = 0, message = "Quantity cannot be negative")
    @Column(nullable = false)
    private Integer quantity = 0;
    
    @NotNull(message = "Unit price is required")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;
    
    @Min(value = 0, message = "Reorder level cannot be negative")
    @Column(nullable = false)
    private Integer reorderLevel = 10;
    
    @Column(length = 1000)
    private String description;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<IssuanceRecord> issuanceRecords;
    
    @Transient
    public boolean isLowStock() {
        return quantity <= reorderLevel;
    }
}
