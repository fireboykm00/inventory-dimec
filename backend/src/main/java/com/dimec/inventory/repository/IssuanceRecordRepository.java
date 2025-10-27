package com.dimec.inventory.repository;

import com.dimec.inventory.model.IssuanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IssuanceRecordRepository extends JpaRepository<IssuanceRecord, Long> {
    List<IssuanceRecord> findByProduct_ProductId(Long productId);
    List<IssuanceRecord> findByUser_UserId(Long userId);
    List<IssuanceRecord> findByIssueDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT ir FROM IssuanceRecord ir ORDER BY ir.issueDate DESC")
    List<IssuanceRecord> findAllOrderByDateDesc();
}
