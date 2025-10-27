package com.dimec.inventory.service;

import com.dimec.inventory.model.Supplier;
import com.dimec.inventory.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SupplierService {
    
    @Autowired
    private SupplierRepository supplierRepository;
    
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }
    
    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
    }
    
    @Transactional
    public Supplier createSupplier(Supplier supplier) {
        if (supplier.getEmail() != null && supplierRepository.existsByEmail(supplier.getEmail())) {
            throw new RuntimeException("Supplier with this email already exists");
        }
        return supplierRepository.save(supplier);
    }
    
    @Transactional
    public Supplier updateSupplier(Long id, Supplier supplierDetails) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        
        supplier.setName(supplierDetails.getName());
        supplier.setContact(supplierDetails.getContact());
        supplier.setEmail(supplierDetails.getEmail());
        supplier.setAddress(supplierDetails.getAddress());
        
        return supplierRepository.save(supplier);
    }
    
    @Transactional
    public void deleteSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        supplierRepository.delete(supplier);
    }
}
