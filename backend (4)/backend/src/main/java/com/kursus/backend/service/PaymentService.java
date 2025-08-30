package com.kursus.backend.service;

import com.kursus.backend.controller.PaymentController.PaymentStats;
import com.kursus.backend.model.Payment;
import com.kursus.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Optional;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    /**
     * Get all payments with pagination and optional status filter
     */
    public Page<Payment> getAllPayments(Pageable pageable, String status) {
        if (status == null || status.trim().isEmpty()) {
            return paymentRepository.findAll(pageable);
        }
        return paymentRepository.findByStatusContainingIgnoreCase(status, pageable);
    }
    
    /**
     * Get payment by ID
     */
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }
    
    /**
     * Create new payment
     */
    public Payment createPayment(Payment payment) {
        // Validation
        if (payment.getAmount() == null || payment.getAmount().doubleValue() <= 0) {
            throw new RuntimeException("Payment amount must be greater than 0");
        }
        
        if (payment.getUserId() == null) {
            throw new RuntimeException("User ID is required");
        }
        
        // Set default values
        if (payment.getStatus() == null) {
            payment.setStatus("PENDING");
        }
        
        if (payment.getCreatedAt() == null) {
            payment.setCreatedAt(LocalDateTime.now());
        }
        
        if (payment.getUpdatedAt() == null) {
            payment.setUpdatedAt(LocalDateTime.now());
        }
        
        return paymentRepository.save(payment);
    }
    
    /**
     * Update payment status
     */
    public Payment updatePaymentStatus(Long id, String status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        
        // Validate status
        if (!isValidStatus(status)) {
            throw new RuntimeException("Invalid payment status: " + status);
        }
        
        payment.setStatus(status.toUpperCase());
        payment.setUpdatedAt(LocalDateTime.now());
        
        // Set completed date if status is SUCCESS
        if ("SUCCESS".equalsIgnoreCase(status)) {
            payment.setCompletedAt(LocalDateTime.now());
        }
        
        return paymentRepository.save(payment);
    }
    
    /**
     * Get payment statistics
     */
    public PaymentStats getPaymentStats() {
        long totalPayments = paymentRepository.count();
        long successfulPayments = paymentRepository.countByStatus("SUCCESS");
        long failedPayments = paymentRepository.countByStatus("FAILED");
        
        Double totalRevenue = paymentRepository.sumAmountByStatus("SUCCESS");
        if (totalRevenue == null) totalRevenue = 0.0;
        
        // Calculate monthly revenue (current month)
        YearMonth currentMonth = YearMonth.now();
        LocalDateTime startOfMonth = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime startOfNextMonth = currentMonth.plusMonths(1).atDay(1).atStartOfDay();
        
        Double monthlyRevenue = paymentRepository.sumAmountByStatusAndDateRange(
                "SUCCESS", startOfMonth, startOfNextMonth);
        if (monthlyRevenue == null) monthlyRevenue = 0.0;
        
        return new PaymentStats(
                totalPayments,
                successfulPayments,
                failedPayments,
                totalRevenue,
                monthlyRevenue
        );
    }
    
    /**
     * Validate payment status
     */
    private boolean isValidStatus(String status) {
        if (status == null) return false;
        
        String[] validStatuses = {"PENDING", "PROCESSING", "SUCCESS", "FAILED", "CANCELLED", "REFUNDED"};
        
        for (String validStatus : validStatuses) {
            if (validStatus.equalsIgnoreCase(status)) {
                return true;
            }
        }
        return false;
    }
}