package com.dimec.inventory.service;

import com.dimec.inventory.dto.CreateIssuanceRequest;
import com.dimec.inventory.dto.IssuanceRecordDTO;
import com.dimec.inventory.model.IssuanceRecord;
import com.dimec.inventory.model.Product;
import com.dimec.inventory.model.User;
import com.dimec.inventory.repository.IssuanceRecordRepository;
import com.dimec.inventory.repository.ProductRepository;
import com.dimec.inventory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IssuanceService {
    
    @Autowired
    private IssuanceRecordRepository issuanceRecordRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductService productService;
    
    public List<IssuanceRecordDTO> getAllIssuances() {
        return issuanceRecordRepository.findAllOrderByDateDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public IssuanceRecordDTO getIssuanceById(Long id) {
        IssuanceRecord record = issuanceRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issuance record not found"));
        return convertToDTO(record);
    }
    
    public List<IssuanceRecordDTO> getIssuancesByDateRange(LocalDate startDate, LocalDate endDate) {
        return issuanceRecordRepository.findByIssueDateBetween(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public IssuanceRecordDTO createIssuance(CreateIssuanceRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Get current user (for now, we'll use the first admin user)
        User user = userRepository.findAll().stream()
                .filter(u -> "ADMIN".equals(u.getRole()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No admin user found"));
        
        // Check if sufficient stock is available
        if (product.getQuantity() < request.getQuantityIssued()) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getQuantity());
        }
        
        IssuanceRecord issuanceRecord = new IssuanceRecord();
        issuanceRecord.setProduct(product);
        issuanceRecord.setUser(user);
        issuanceRecord.setQuantityIssued(request.getQuantityIssued());
        issuanceRecord.setIssuedTo(request.getIssuedTo());
        issuanceRecord.setPurpose(request.getPurpose());
        issuanceRecord.setIssueDate(LocalDate.now());
        
        // Update product stock
        productService.updateStock(product.getProductId(), -request.getQuantityIssued());
        
        IssuanceRecord saved = issuanceRecordRepository.save(issuanceRecord);
        return convertToDTO(saved);
    }
    
    @Transactional
    public void deleteIssuance(Long id) {
        IssuanceRecord record = issuanceRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issuance record not found"));
        
        // Restore product stock
        productService.updateStock(record.getProduct().getProductId(), record.getQuantityIssued());
        
        issuanceRecordRepository.delete(record);
    }
    
    private IssuanceRecordDTO convertToDTO(IssuanceRecord record) {
        IssuanceRecordDTO dto = new IssuanceRecordDTO();
        dto.setIssuanceId(record.getIssuanceId());
        dto.setProductId(record.getProduct().getProductId());
        dto.setProductName(record.getProduct().getName());
        dto.setUserId(record.getUser().getUserId());
        dto.setUserName(record.getUser().getName());
        dto.setQuantityIssued(record.getQuantityIssued());
        dto.setIssuedTo(record.getIssuedTo());
        dto.setIssueDate(record.getIssueDate());
        dto.setPurpose(record.getPurpose());
        return dto;
    }
}
