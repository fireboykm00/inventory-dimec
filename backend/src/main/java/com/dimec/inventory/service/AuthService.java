package com.dimec.inventory.service;

import com.dimec.inventory.config.JwtUtil;
import com.dimec.inventory.dto.LoginRequest;
import com.dimec.inventory.dto.LoginResponse;
import com.dimec.inventory.dto.RegisterRequest;
import com.dimec.inventory.model.User;
import com.dimec.inventory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public LoginResponse login(LoginRequest request) {
        // Validate input
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        
        // Find user
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new EntityNotFoundException("Invalid email or password"));
        
        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new EntityNotFoundException("Invalid email or password");
        }
        
        // Generate token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        
        return new LoginResponse(token, user.getUserId(), user.getName(), user.getEmail(), user.getRole());
    }
    
    public User register(RegisterRequest request) {
        // Validate input
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long");
        }
        if (request.getRole() == null || request.getRole().trim().isEmpty()) {
            throw new IllegalArgumentException("Role is required");
        }
        
        // Validate email format
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        if (!request.getEmail().matches(emailRegex)) {
            throw new IllegalArgumentException("Invalid email format");
        }
        
        // Check if email already exists
        String normalizedEmail = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        // Validate role
        if (!isValidRole(request.getRole())) {
            throw new IllegalArgumentException("Invalid role. Must be one of: ADMIN, INVENTORY_CLERK, VIEWER");
        }
        
        // Create new user
        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole().toUpperCase());
        
        try {
            return userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to register user: " + e.getMessage(), e);
        }
    }
    
    private boolean isValidRole(String role) {
        return "ADMIN".equals(role.toUpperCase()) || 
               "INVENTORY_CLERK".equals(role.toUpperCase()) || 
               "VIEWER".equals(role.toUpperCase());
    }
}
