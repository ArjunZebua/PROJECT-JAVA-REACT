package com.kursus.backend.repository;

import com.kursus.backend.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    
    // Find materials by course ID ordered by order index
    List<Material> findByCourseIdOrderByOrderIndex(Long courseId);
    
    // Find materials by course ID
    List<Material> findByCourseId(Long courseId);
    
    // Count materials by course ID
    Long countByCourseId(Long courseId);
    
    // Find materials by type
    List<Material> findByType(Material.MaterialType type);
    
    // Find materials by course ID and type
    List<Material> findByCourseIdAndType(Long courseId, Material.MaterialType type);
    
    // Get materials count by course
    @Query("SELECT COUNT(m) FROM Material m WHERE m.course.id = :courseId")
    Long countMaterialsByCourse(@Param("courseId") Long courseId);
}
