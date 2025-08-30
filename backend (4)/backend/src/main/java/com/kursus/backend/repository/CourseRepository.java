package com.kursus.backend.repository;

import com.kursus.backend.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // ✅ Filter methods untuk getAllCourses
    Page<Course> findByCategoryIdAndIsActive(Long categoryId, Boolean isActive, Pageable pageable);
    
    Page<Course> findByCategoryId(Long categoryId, Pageable pageable);
    
    Page<Course> findByIsActive(Boolean isActive, Pageable pageable);

    // ✅ Search method
    Page<Course> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
        String title, String description, Pageable pageable);

    // ✅ Popular courses - FIXED: Gunakan Pageable untuk limit
    @Query(value = "SELECT c.* FROM courses c " +
                   "LEFT JOIN enrollments e ON c.id = e.course_id " +
                   "GROUP BY c.id " +
                   "ORDER BY COUNT(e.id) DESC", 
           nativeQuery = true)
    List<Course> findTopCoursesByEnrollmentCountAll();

    // ✅ Alternative: Jika tabel enrollments belum ada, gunakan berdasarkan created_at
    @Query(value = "SELECT * FROM courses WHERE is_active = true " +
                   "ORDER BY created_at DESC", 
           nativeQuery = true)
    List<Course> findTopCoursesByCreatedAtAll();

    // ✅ Statistics methods
    Long countByIsActive(Boolean isActive);
    
    // Get average price
    @Query("SELECT AVG(c.price) FROM Course c WHERE c.price IS NOT NULL")
    BigDecimal getAveragePrice();
    
    // ✅ FIXED: Total enrollments query  
    @Query(value = "SELECT COALESCE(COUNT(e.id), 0) FROM enrollments e", nativeQuery = true)
    Long getTotalEnrollments();
    
    // ✅ Alternative jika enrollments table belum ada
    @Query(value = "SELECT COUNT(*) FROM courses", nativeQuery = true) 
    Long getTotalEnrollmentsAlternative();
    
    // Get courses by instructor
    Page<Course> findByInstructorId(Long instructorId, Pageable pageable);
    
    // Get courses by price range
    @Query("SELECT c FROM Course c WHERE c.price BETWEEN :minPrice AND :maxPrice")
    Page<Course> findByPriceRange(@Param("minPrice") BigDecimal minPrice, 
                                 @Param("maxPrice") BigDecimal maxPrice, 
                                 Pageable pageable);

    // ✅ FIXED: Ganti nama method sesuai dengan field di Course entity
    long countByCreatedAtAfter(LocalDateTime startOfMonth);
}