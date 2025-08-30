package com.kursus.backend.service;

import com.kursus.backend.DTO.CourseDTO;
import com.kursus.backend.model.Course;
import com.kursus.backend.model.Material;
// import com.kursus.backend.model.Material.MaterialType;
import com.kursus.backend.repository.CourseRepository;
import com.kursus.backend.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @SuppressWarnings("unused")
    @Autowired
    private CategoryService categoryService;

    private final String UPLOAD_DIR = "uploads/materials/";

    // ===============================
    // COURSE CRUD
    // ===============================
public Page<CourseDTO> getAllCourses(Pageable pageable, Long categoryId, Boolean isActive) {
    Page<Course> courses;

    if (categoryId != null && isActive != null) {
        courses = courseRepository.findByCategoryIdAndIsActive(categoryId, isActive, pageable);
    } else if (categoryId != null) {
        courses = courseRepository.findByCategoryId(categoryId, pageable);
    } else if (isActive != null) {
        courses = courseRepository.findByIsActive(isActive, pageable);
    } else {
        courses = courseRepository.findAll(pageable);
    }

    // map ke DTO
    return courses.map(this::dto);
}
    private CourseDTO dto(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setPrice(course.getPrice());
        dto.setLevel(course.getLevel());
        dto.setDuration(course.getDuration());
        dto.setImageUrl(course.getImageUrl());
        // relasi
        dto.setCategoryId(course.getCategory().getId());
        return dto;
}


    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public Course createCourse(Course course) {
        if(course.getIsActive() == null) course.setIsActive(true);
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id " + id));

        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setIsActive(courseDetails.getIsActive());
        course.setCategory(courseDetails.getCategory());
        // course.setPrice(courseDetails.getPrice());
        course.setImageUrl(courseDetails.getImageUrl());

        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found with id " + id);
        }
        courseRepository.deleteById(id);
    }

    public Course toggleCourseStatus(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id " + courseId));
        course.setIsActive(!course.getIsActive());
        return courseRepository.save(course);
    }

    public Page<Course> getCoursesByCategory(Long categoryId, Pageable pageable) {
        return courseRepository.findByCategoryId(categoryId, pageable);
    }

    // ===============================
    // MATERIAL MANAGEMENT
    // ===============================
    public Material uploadMaterial(Long courseId, MultipartFile file, String title, String description, String type) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id " + courseId));

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            Material material = new Material();
            material.setCourse(course);
            material.setTitle(title);
            material.setDescription(description);
            try {
                material.setType(Material.MaterialType.valueOf(type.toUpperCase()));
            } catch (IllegalArgumentException e) {
                material.setType(Material.MaterialType.PDF);
            }
            material.setFileName(filename);
            material.setFileUrl("/api/files/" + filename);

            List<Material> existingMaterials = materialRepository.findByCourseIdOrderByOrderIndex(courseId);
            material.setOrderIndex(existingMaterials.size() + 1);

            return materialRepository.save(material);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    public List<Material> getCourseMaterials(Long courseId) {
        return materialRepository.findByCourseIdOrderByOrderIndex(courseId);
    }

    public void deleteMaterial(Long materialId) {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found with id " + materialId));
        try {
            if (material.getFileName() != null) {
                Path filePath = Paths.get(UPLOAD_DIR, material.getFileName());
                if (Files.exists(filePath)) Files.delete(filePath);
            }
        } catch (IOException e) {
            System.err.println("Failed to delete file: " + e.getMessage());
        }
        materialRepository.delete(material);
    }

    // ===============================
    // SEARCH & POPULAR
    // ===============================
    public Page<Course> searchCourses(String keyword, Pageable pageable) {
        return courseRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword, pageable);
    }

    public List<Course> getPopularCourses(int limit) {
        List<Course> allCourses = courseRepository.findTopCoursesByCreatedAtAll();
        return allCourses.stream().limit(limit).toList();
    }

    // ===============================
    // STATISTICS
    // ===============================
    public Long getCourseCount() {
        return courseRepository.count();
    }

    public Map<String, Object> getCourseStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCourses", courseRepository.count());
        stats.put("activeCourses", courseRepository.countByIsActive(true));
        stats.put("inactiveCourses", courseRepository.countByIsActive(false));
        stats.put("totalMaterials", materialRepository.count());
        stats.put("averagePrice", courseRepository.getAveragePrice());
        stats.put("totalEnrollments", getTotalEnrollments());
        return stats;
    }

    private Long getTotalEnrollments() {
        try {
            return courseRepository.getTotalEnrollments();
        } catch (Exception e) {
            return 0L;
        }
    }
}
