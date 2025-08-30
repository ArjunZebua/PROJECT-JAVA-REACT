package com.kursus.backend.repository;

import com.kursus.backend.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    // Find enrollments by user
    List<Enrollment> findByUserId(Long userId);

    // Find enrollments by course
    List<Enrollment> findByCourseId(Long courseId);

    // Check if user is enrolled in a course
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    // Count total enrollments
    long count();

    // ✅ Methods untuk Dashboard Statistics - FIXED
    
    // Calculate total revenue from Course price
    @Query("SELECT COALESCE(SUM(c.price), 0.0) FROM Enrollment e JOIN e.course c")
    Double calculateTotalRevenue();

    // Calculate revenue by date range from Course price
    @Query("SELECT COALESCE(SUM(c.price), 0.0) FROM Enrollment e JOIN e.course c WHERE e.enrolledAt BETWEEN :start AND :end")
    Double calculateRevenueByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Find most popular course name
    @Query("SELECT c.title FROM Enrollment e JOIN e.course c GROUP BY c.id, c.title ORDER BY COUNT(e.id) DESC LIMIT 1")
    String findMostPopularCourseName();

    // ✅ Additional useful methods
    
    // Alternative methods with more specific names
    @Query("SELECT COALESCE(SUM(c.price), 0.0) FROM Enrollment e JOIN e.course c")
    Double calculateTotalRevenueFromCourse();

    @Query("SELECT COALESCE(SUM(c.price), 0.0) FROM Enrollment e JOIN e.course c WHERE e.enrolledAt BETWEEN :start AND :end")
    Double calculateRevenueFromCourseByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Find enrollments by date range
    List<Enrollment> findByEnrolledAtBetween(LocalDateTime start, LocalDateTime end);

    // Count enrollments this month
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.enrolledAt >= :startOfMonth")
    long countEnrollmentsThisMonth(@Param("startOfMonth") LocalDateTime startOfMonth);

    // Count enrollments by date range
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.enrolledAt BETWEEN :start AND :end")
    long countEnrollmentsByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Get average course price for enrolled courses
    @Query("SELECT AVG(c.price) FROM Enrollment e JOIN e.course c")
    Double getAverageCoursePrice();
}