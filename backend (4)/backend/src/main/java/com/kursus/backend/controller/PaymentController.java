package com.kursus.backend.controller;

import com.kursus.backend.model.Payment;
import com.kursus.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@SuppressWarnings("unused")
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @GetMapping
    public ResponseEntity<Page<Payment>> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String status) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : 
            Sort.by(sortBy).ascending();
            
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Payment> payments = paymentService.getAllPayments(pageable, status);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id)
                           .map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        try {
            Payment savedPayment = paymentService.createPayment(payment);
            return ResponseEntity.ok(savedPayment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Payment> updatePaymentStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        try {
            Payment updatedPayment = paymentService.updatePaymentStatus(id, status);
            return ResponseEntity.ok(updatedPayment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<PaymentStats> getPaymentStats() {
        PaymentStats stats = paymentService.getPaymentStats();
        return ResponseEntity.ok(stats);
    }
    
    public static class PaymentStats {
        private long totalPayments;
        private long successfulPayments;
        private long failedPayments;
        private double totalRevenue;
        private double monthlyRevenue;
        
        public PaymentStats(long totalPayments, long successfulPayments, long failedPayments, 
                           double totalRevenue, double monthlyRevenue) {
            this.totalPayments = totalPayments;
            this.successfulPayments = successfulPayments;
            this.failedPayments = failedPayments;
            this.totalRevenue = totalRevenue;
            this.monthlyRevenue = monthlyRevenue;
        }
        
        // Getters and setters
        public long getTotalPayments() { return totalPayments; }
        public long getSuccessfulPayments() { return successfulPayments; }
        public long getFailedPayments() { return failedPayments; }
        public double getTotalRevenue() { return totalRevenue; }
        public double getMonthlyRevenue() { return monthlyRevenue; }
    }
}
