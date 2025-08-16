package com.kursus.backend.service;

import com.kursus.backend.model.Course;
import com.kursus.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    // Ambil semua course (misal sudah ada)
    // public Page<Course> getAllCourses(Pageable pageable, Long categoryId, Boolean isActive) { ... }

    // 🔹 Tambahan method untuk ambil course by ID
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    // Tambahan method CRUD lain (create, update, delete)
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id " + id));

        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setIsActive(courseDetails.getIsActive());
        course.setCategory(courseDetails.getCategory());

        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found with id " + id);
        }
        courseRepository.deleteById(id);
    }
}
