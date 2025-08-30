package com.kursus.backend.service;

import com.kursus.backend.controller.DashboardController.DashboardStats;
import com.kursus.backend.repository.UserRepository;
import com.kursus.backend.repository.CourseRepository;
import com.kursus.backend.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;

@Service
public class DashboardService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    public DashboardStats getDashboardStats() {
        // Get current date for monthly calculations
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.with(TemporalAdjusters.firstDayOfMonth()).withHour(0).withMinute(0).withSecond(0);
        
        // Calculate all statistics
        long totalUsers = getTotalUsers();
        long totalCourses = getTotalCourses();
        long activeCourses = getActiveCourses();
        long totalEnrollments = getTotalEnrollments();
        double totalRevenue = getTotalRevenue();
        double monthlyRevenue = getMonthlyRevenue(startOfMonth);
        String mostPopularCourse = getMostPopularCourse();
        long newUsersThisMonth = getNewUsersThisMonth(startOfMonth);
        long newCoursesThisMonth = getNewCoursesThisMonth(startOfMonth);
        
        return new DashboardStats(
            totalUsers,
            totalCourses, 
            activeCourses,
            totalEnrollments,
            totalRevenue,
            monthlyRevenue,
            mostPopularCourse,
            newUsersThisMonth,
            newCoursesThisMonth
        );
    }
    
    private long getTotalUsers() {
        try {
            return userRepository.count();
        } catch (Exception e) {
            return 0;
        }
    }
    
    private long getTotalCourses() {
        try {
            return courseRepository.count();
        } catch (Exception e) {
            return 0;
        }
    }
    
    private long getActiveCourses() {
        try {
            // ✅ FIXED: Ganti dengan method yang benar sesuai field isActive
            return courseRepository.countByIsActive(true);
        } catch (Exception e) {
            // Fallback: assume all courses are active
            return getTotalCourses();
        }
    }
    
    private long getTotalEnrollments() {
        try {
            return enrollmentRepository.count();
        } catch (Exception e) {
            return 0;
        }
    }
    
    private double getTotalRevenue() {
        try {
            // Assuming there's a method to calculate total revenue
            // You might need to add this method to EnrollmentRepository or create a PaymentRepository
            Double revenue = enrollmentRepository.calculateTotalRevenue();
            return revenue != null ? revenue : 0.0;
        } catch (Exception e) {
            return 0.0;
        }
    }
    
    private double getMonthlyRevenue(LocalDateTime startOfMonth) {
        try {
            // Calculate revenue for current month
            Double revenue = enrollmentRepository.calculateRevenueByDateRange(startOfMonth, LocalDateTime.now());
            return revenue != null ? revenue : 0.0;
        } catch (Exception e) {
            return 0.0;
        }
    }
    
    private String getMostPopularCourse() {
        try {
            // Get course with most enrollments
            String courseName = enrollmentRepository.findMostPopularCourseName();
            return courseName != null ? courseName : "No data available";
        } catch (Exception e) {
            return "No data available";
        }
    }
    
    private long getNewUsersThisMonth(LocalDateTime startOfMonth) {
        try {
            // ✅ FIXED: Ganti dengan method yang benar sesuai field createdAt di User entity
            return userRepository.countByCreatedAtAfter(startOfMonth);
        } catch (Exception e) {
            return 0;
        }
    }
    
    private long getNewCoursesThisMonth(LocalDateTime startOfMonth) {
        try {
            // ✅ FIXED: Ganti dengan method yang benar sesuai field createdAt
            return courseRepository.countByCreatedAtAfter(startOfMonth);
        } catch (Exception e) {
            return 0;
        }
    }
}