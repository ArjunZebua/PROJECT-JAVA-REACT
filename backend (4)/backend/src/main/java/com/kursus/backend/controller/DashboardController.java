package com.kursus.backend.controller;

import com.kursus.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        DashboardStats stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
    
    public static class DashboardStats {
        private long totalUsers;
        private long totalCourses;
        private long activeCourses;
        private long totalEnrollments;
        private double totalRevenue;
        private double monthlyRevenue;
        private String mostPopularCourse;
        private long newUsersThisMonth;
        private long newCoursesThisMonth;
        
        public DashboardStats(long totalUsers, long totalCourses, long activeCourses, 
                             long totalEnrollments, double totalRevenue, double monthlyRevenue,
                             String mostPopularCourse, long newUsersThisMonth, long newCoursesThisMonth) {
            this.totalUsers = totalUsers;
            this.totalCourses = totalCourses;
            this.activeCourses = activeCourses;
            this.totalEnrollments = totalEnrollments;
            this.totalRevenue = totalRevenue;
            this.monthlyRevenue = monthlyRevenue;
            this.mostPopularCourse = mostPopularCourse;
            this.newUsersThisMonth = newUsersThisMonth;
            this.newCoursesThisMonth = newCoursesThisMonth;
        }
        
        // Getters and setters
        public long getTotalUsers() { return totalUsers; }
        public long getTotalCourses() { return totalCourses; }
        public long getActiveCourses() { return activeCourses; }
        public long getTotalEnrollments() { return totalEnrollments; }
        public double getTotalRevenue() { return totalRevenue; }
        public double getMonthlyRevenue() { return monthlyRevenue; }
        public String getMostPopularCourse() { return mostPopularCourse; }
        public long getNewUsersThisMonth() { return newUsersThisMonth; }
        public long getNewCoursesThisMonth() { return newCoursesThisMonth; }
    }
}
