package com.dimec.inventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Entity
@Table(name = "suppliers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id")
    private Long supplierId;
    
    @NotBlank(message = "Supplier name is required")
    @Column(nullable = false)
    private String name;
    
    @NotBlank(message = "Contact is required")
    @Column(nullable = false)
    private String contact;
    
    @Email(message = "Invalid email format")
    @Column(unique = true)
    private String email;
    
    @Column(length = 500)
    private String address;
    
    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Product> products;
}
