package com.kursus.backend.repository;

import com.kursus.backend.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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

    // ✅ Popular courses query
    @Query("SELECT c FROM Course c LEFT JOIN c.enrollments e " +
           "GROUP BY c ORDER BY COUNT(e) DESC")
    List<Course> findTopCoursesByEnrollmentCount(@Param("limit") int limit);

    // Alternative jika tidak ada enrollments table
    @Query(value = "SELECT * FROM courses ORDER BY created_at DESC LIMIT :limit", 
           nativeQuery = true)
    List<Course> findTopCoursesByCreatedAt(@Param("limit") int limit);

    // ✅ Statistics methods
    Long countByIsActive(Boolean isActive);
    
    @Query("SELECT AVG(SIZE(c.enrollments)) FROM Course c")
    Double getAverageEnrollmentCount();
    
    // Alternative jika tidak ada enrollments
    @Query("SELECT COUNT(c) FROM Course c")
    Double getAverageEnrollmentCountAlternative();
}