package com.dimec.inventory.service;

import com.dimec.inventory.dto.CreateProductRequest;
import com.dimec.inventory.dto.ProductDTO;
import com.dimec.inventory.dto.UpdateProductRequest;
import com.dimec.inventory.model.Category;
import com.dimec.inventory.model.Product;
import com.dimec.inventory.model.Supplier;
import com.dimec.inventory.repository.CategoryRepository;
import com.dimec.inventory.repository.ProductRepository;
import com.dimec.inventory.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private SupplierRepository supplierRepository;
    
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDTO(product);
    }
    
    public List<ProductDTO> getLowStockProducts() {
        return productRepository.findLowStockProducts().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductDTO> searchProducts(String searchTerm) {
        return productRepository.searchByName(searchTerm).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ProductDTO createProduct(CreateProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        
        Product product = new Product();
        product.setName(request.getName());
        product.setCategory(category);
        product.setSupplier(supplier);
        product.setQuantity(request.getQuantity());
        product.setUnitPrice(request.getUnitPrice());
        product.setReorderLevel(request.getReorderLevel());
        product.setDescription(request.getDescription());
        
        Product saved = productRepository.save(product);
        return convertToDTO(saved);
    }
    
    @Transactional
    public ProductDTO updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setName(request.getName());
        product.setQuantity(request.getQuantity());
        product.setUnitPrice(request.getUnitPrice());
        product.setReorderLevel(request.getReorderLevel());
        product.setDescription(request.getDescription());
        
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }
        
        if (request.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Supplier not found"));
            product.setSupplier(supplier);
        }
        
        Product updated = productRepository.save(product);
        return convertToDTO(updated);
    }
    
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }
    
    @Transactional
    public void updateStock(Long productId, int quantityChange) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        int newQuantity = product.getQuantity() + quantityChange;
        if (newQuantity < 0) {
            throw new RuntimeException("Insufficient stock");
        }
        
        product.setQuantity(newQuantity);
        productRepository.save(product);
    }
    
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setCategoryId(product.getCategory().getCategoryId());
        dto.setCategoryName(product.getCategory().getName());
        dto.setSupplierId(product.getSupplier().getSupplierId());
        dto.setSupplierName(product.getSupplier().getName());
        dto.setQuantity(product.getQuantity());
        dto.setUnitPrice(product.getUnitPrice());
        dto.setReorderLevel(product.getReorderLevel());
        dto.setDescription(product.getDescription());
        dto.setLowStock(product.isLowStock());
        return dto;
    }
}
