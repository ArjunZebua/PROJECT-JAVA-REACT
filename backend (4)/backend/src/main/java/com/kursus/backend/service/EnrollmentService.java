// package com.kursus.backend.service;

// import com.kursus.backend.model.Enrollment;
// import com.kursus.backend.model.Course;
// import com.kursus.backend.model.User;
// import com.kursus.backend.repository.EnrollmentRepository;
// import com.kursus.backend.repository.CourseRepository;
// import com.kursus.backend.repository.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Optional;

// @Service
// @Transactional
// public class EnrollmentService {

//     @Autowired
//     private EnrollmentRepository enrollmentRepository;

//     @Autowired
//     private CourseRepository courseRepository;

//     @Autowired
//     private UserRepository userRepository;

//     public Enrollment enrollUser(Long userId, Long courseId) {
//         // Validate user exists
//         User user = userRepository.findById(userId)
//                 .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

//         // Validate course exists and is active
//         Course course = courseRepository.findById(courseId)
//                 .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

//         if (!course.getIsActive()) {
//             throw new RuntimeException("Course is not active");
//         }

//         // Check if user is already enrolled
//         Optional<Enrollment> existingEnrollment = enrollmentRepository
//                 .findByUserIdAndCourseId(userId, courseId);
        
//         if (existingEnrollment.isPresent()) {
//             throw new RuntimeException("User is already enrolled in this course");
//         }

//         // Create new enrollment
//         Enrollment enrollment = new Enrollment();
//         enrollment.setUser(user);
//         enrollment.setCourse(course);
//         enrollment.setEnrolledAt(LocalDateTime.now());
//         enrollment.setStatus("ENROLLED");
//         enrollment.setProgress(0.0);

//         return enrollmentRepository.save(enrollment);
//     }

//     public List<Enrollment> getUserEnrollments(Long userId) {
//         return enrollmentRepository.findByUserIdOrderByEnrolledAtDesc(userId);
//     }

//     public Page<Course> getEnrolledCourses(Long userId, Pageable pageable) {
//         return enrollmentRepository.findCoursesByUserId(userId, pageable);
//     }

//     public Optional<Enrollment> getEnrollment(Long userId, Long courseId) {
//         return enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
//     }

//     public Enrollment updateProgress(Long enrollmentId, Double progress) {
//         Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
//                 .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + enrollmentId));
        
//         enrollment.setProgress(Math.min(Math.max(progress, 0.0), 100.0));
        
//         if (enrollment.getProgress() >= 100.0) {
//             enrollment.setStatus("COMPLETED");
//             enrollment.setCompletedAt(LocalDateTime.now());
//         }

//         return enrollmentRepository.save(enrollment);
//     }

//     public void cancelEnrollment(Long enrollmentId) {
//         Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
//                 .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + enrollmentId));
        
//         enrollment.setStatus("CANCELLED");
//         enrollmentRepository.save(enrollment);
//     }

//     public Long getTotalEnrollments() {
//         return enrollmentRepository.count();
//     }

//     public Long getUserEnrollmentCount(Long userId) {
//         return enrollmentRepository.countByUserId(userId);
//     }

//     public List<Enrollment> getRecentEnrollments(int limit) {
//         return enrollmentRepository.findRecentEnrollments(limit);
//     }

//     public Long getEnrollmentCountForCourse(Long courseId) {
//         return enrollmentRepository.countByCourseId(courseId);
//     }
// }
