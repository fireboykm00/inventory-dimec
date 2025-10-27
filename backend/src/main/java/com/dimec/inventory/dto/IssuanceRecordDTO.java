package com.dimec.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssuanceRecordDTO {
    private Long issuanceId;
    private Long productId;
    private String productName;
    private Long userId;
    private String userName;
    private Integer quantityIssued;
    private String issuedTo;
    private LocalDate issueDate;
    private String purpose;
}
