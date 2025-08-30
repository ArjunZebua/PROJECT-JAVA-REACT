package com.kursus.backend.repository;

import com.kursus.backend.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    /**
     * Find payments by status with pagination
     */
    Page<Payment> findByStatusContainingIgnoreCase(String status, Pageable pageable);
    
    /**
     * Count payments by status
     */
    long countByStatus(String status);
    
    /**
     * Sum amount by status
     */
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status")
    Double sumAmountByStatus(@Param("status") String status);
    
    /**
     * Sum amount by status and date range
     */
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status AND p.createdAt >= :startDate AND p.createdAt < :endDate")
    Double sumAmountByStatusAndDateRange(
            @Param("status") String status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
    
    /**
     * Find payments by user ID with pagination
     */
    Page<Payment> findByUserId(Long userId, Pageable pageable);
    
    /**
     * Find payments by status and user ID with pagination
     */
    Page<Payment> findByStatusAndUserId(String status, Long userId, Pageable pageable);
    
    /**
     * Find payments by date range
     */
    @Query("SELECT p FROM Payment p WHERE p.createdAt >= :startDate AND p.createdAt <= :endDate")
    Page<Payment> findByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );
}