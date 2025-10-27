package com.dimec.inventory.controller;

import com.dimec.inventory.dto.CreateIssuanceRequest;
import com.dimec.inventory.dto.IssuanceRecordDTO;
import com.dimec.inventory.model.IssuanceRecord;
import com.dimec.inventory.service.IssuanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/issuances")
public class IssuanceController {
    
    @Autowired
    private IssuanceService issuanceService;
    
    @GetMapping
    public ResponseEntity<List<IssuanceRecordDTO>> getAllIssuances() {
        return ResponseEntity.ok(issuanceService.getAllIssuances());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<IssuanceRecordDTO> getIssuanceById(@PathVariable Long id) {
        return ResponseEntity.ok(issuanceService.getIssuanceById(id));
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<IssuanceRecordDTO>> getIssuancesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(issuanceService.getIssuancesByDateRange(startDate, endDate));
    }
    
    @PostMapping
    public ResponseEntity<IssuanceRecordDTO> createIssuance(@Valid @RequestBody CreateIssuanceRequest request) {
        return ResponseEntity.ok(issuanceService.createIssuance(request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssuance(@PathVariable Long id) {
        issuanceService.deleteIssuance(id);
        return ResponseEntity.noContent().build();
    }
}
