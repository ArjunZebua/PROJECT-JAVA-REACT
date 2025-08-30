package com.kursus.backend.controller;

import com.kursus.backend.DTO.CourseDTO;
import com.kursus.backend.model.Course;
import com.kursus.backend.model.Material;
import com.kursus.backend.repository.CategoryRepository;
import com.kursus.backend.service.CourseService;
import com.kursus.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

// @SuppressWarnings("unused")
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private CategoryService categoryService;

    // ===============================
    // COURSE MANAGEMENT ENDPOINTS
    // ===============================

    @GetMapping("/allCourses")
    public ResponseEntity<Page<CourseDTO>> getAllCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean isActive) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(courseService.getAllCourses(pageable, categoryId, isActive));
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST COURSE menggunakan DTO (tanpa gambar)
    @PostMapping("/createCourses")
    public ResponseEntity<Map<String, Object>> createCourse(@RequestBody CourseDTO dto) {
        Map<String, Object> response = new HashMap<>();

        if(dto.getTitle() == null || dto.getTitle().isEmpty()) {
            response.put("success", false);
            response.put("message", "Judul kursus wajib diisi");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            // Konversi DTO menjadi Entity Course
            Course course = new Course();
            course.setTitle(dto.getTitle());
            course.setDescription(dto.getDescription());
            course.setLevel(dto.getLevel());
            course.setDuration(dto.getDuration());

            // Set price jika ada
            if(dto.getPrice() != null) {
                course.setPrice(dto.getPrice());
            }

            course.setImageUrl(dto.getImageUrl());
            course.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

            if(dto.getCategoryId() != null) {
                categoryService.getCategoryById(dto.getCategoryId())
                        .ifPresent(course::setCategory);
            }

            // Simpan Course
            Course savedCourse = courseService.createCourse(course);

            response.put("success", true);
            response.put("message", "Kursus berhasil ditambahkan");
            response.put("data", savedCourse);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Terjadi kesalahan internal: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // PUT COURSE menggunakan DTO (tanpa gambar)
    @PutMapping("/courses/{id}")
    public ResponseEntity<Map<String, Object>> updateCourse(
            @PathVariable Long id,
            @RequestBody CourseDTO dto) {
        Map<String, Object> response = new HashMap<>();
        try {
            Course course = courseService.getCourseById(id)
                    .orElseThrow(() -> new RuntimeException("Course not found with id " + id));

            course.setTitle(dto.getTitle());
            course.setDescription(dto.getDescription());
            course.setLevel(dto.getLevel());
            course.setDuration(dto.getDuration());

            // Update price jika ada
            if(dto.getPrice() != null) {
                course.setPrice(dto.getPrice());
            }

            if(dto.getImageUrl() != null) {
                course.setImageUrl(dto.getImageUrl());
            }
            
            course.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : course.getIsActive());

            if(dto.getCategoryId() != null) {
                categoryService.getCategoryById(dto.getCategoryId())
                        .ifPresent(course::setCategory);
            }

            Course updatedCourse = courseService.createCourse(course);

            response.put("success", true);
            response.put("message", "Kursus berhasil diperbarui");
            response.put("data", updatedCourse);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Terjadi kesalahan internal: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ===============================
    // COURSE WITH IMAGE ENDPOINTS
    // ===============================

    // POST COURSE dengan gambar
    @PostMapping("/courses/upload")
    public ResponseEntity<Map<String, Object>> createCourseWithImage(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") String price,
            @RequestParam("level") String level,
            @RequestParam("duration") String duration,
            @RequestParam(value = "isActive", defaultValue = "true") Boolean isActive,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam("image") MultipartFile imageFile) {

        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validasi input
            if (title == null || title.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Judul kursus wajib diisi");
                return ResponseEntity.badRequest().body(response);
            }

            if (description == null || description.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Deskripsi kursus wajib diisi");
                return ResponseEntity.badRequest().body(response);
            }

            // Validasi file gambar
            if (imageFile.isEmpty()) {
                response.put("success", false);
                response.put("message", "File gambar tidak boleh kosong");
                return ResponseEntity.badRequest().body(response);
            }

            // Validasi tipe file
            String contentType = imageFile.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                response.put("success", false);
                response.put("message", "File harus berupa gambar");
                return ResponseEntity.badRequest().body(response);
            }

            // Validasi ukuran file (max 2MB)
            if (imageFile.getSize() > 2 * 1024 * 1024) {
                response.put("success", false);
                response.put("message", "Ukuran file maksimal 2MB");
                return ResponseEntity.badRequest().body(response);
            }

            // Upload gambar
            String imageUrl = uploadImage(imageFile);

            // Buat course entity
            Course course = new Course();
            course.setTitle(title.trim());
            course.setDescription(description.trim());
            course.setPrice(new BigDecimal(price));
            course.setLevel(level);
            course.setDuration(Integer.parseInt(duration));
            course.setIsActive(isActive);
            course.setImageUrl(imageUrl);

            if (categoryId != null) {
                categoryService.getCategoryById(categoryId).ifPresent(course::setCategory);
            }

            Course saved = courseService.createCourse(course);

            response.put("success", true);
            response.put("message", "Kursus berhasil ditambahkan dengan gambar");
            response.put("data", saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (NumberFormatException e) {
            response.put("success", false);
            response.put("message", "Format harga atau durasi tidak valid");
            return ResponseEntity.badRequest().body(response);
        } catch (IOException e) {
            response.put("success", false);
            response.put("message", "Gagal upload gambar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Gagal membuat kursus: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // PUT COURSE dengan gambar
    @PutMapping("/courses/{id}/upload")
    public ResponseEntity<Map<String, Object>> updateCourseWithImage(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") String price,
            @RequestParam("level") String level,
            @RequestParam("duration") String duration,
            @RequestParam(value = "isActive", defaultValue = "true") Boolean isActive,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validasi input
            if (title == null || title.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Judul kursus wajib diisi");
                return ResponseEntity.badRequest().body(response);
            }

            if (description == null || description.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Deskripsi kursus wajib diisi");
                return ResponseEntity.badRequest().body(response);
            }

            // Ambil course yang ada
            Course course = courseService.getCourseById(id)
                    .orElseThrow(() -> new RuntimeException("Course not found with id " + id));

            // Update data course
            course.setTitle(title.trim());
            course.setDescription(description.trim());
            course.setPrice(new BigDecimal(price));
            course.setLevel(level);
            course.setDuration(Integer.parseInt(duration));
            course.setIsActive(isActive);

            if (categoryId != null) {
                categoryService.getCategoryById(categoryId).ifPresent(course::setCategory);
            }

            // Jika ada file gambar baru, upload dan update URL
            if (imageFile != null && !imageFile.isEmpty()) {
                // Validasi tipe file
                String contentType = imageFile.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    response.put("success", false);
                    response.put("message", "File harus berupa gambar");
                    return ResponseEntity.badRequest().body(response);
                }

                // Validasi ukuran file (max 2MB)
                if (imageFile.getSize() > 2 * 1024 * 1024) {
                    response.put("success", false);
                    response.put("message", "Ukuran file maksimal 2MB");
                    return ResponseEntity.badRequest().body(response);
                }

                // Hapus gambar lama jika ada
                deleteOldImage(course.getImageUrl());

                // Upload gambar baru
                String imageUrl = uploadImage(imageFile);
                course.setImageUrl(imageUrl);
            }

            Course updated = courseService.createCourse(course);

            response.put("success", true);
            response.put("message", "Kursus berhasil diperbarui");
            response.put("data", updated);
            return ResponseEntity.ok(response);

        } catch (NumberFormatException e) {
            response.put("success", false);
            response.put("message", "Format harga atau durasi tidak valid");
            return ResponseEntity.badRequest().body(response);
        } catch (IOException e) {
            response.put("success", false);
            response.put("message", "Gagal upload gambar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Gagal update kursus: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ===============================
    // OTHER COURSE ENDPOINTS
    // ===============================

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Map<String, Object>> deleteCourse(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Ambil course untuk mendapatkan URL gambar
            Course course = courseService.getCourseById(id)
                    .orElseThrow(() -> new RuntimeException("Course not found with id " + id));

            // Hapus gambar jika ada
            deleteOldImage(course.getImageUrl());

            // Hapus course
            courseService.deleteCourse(id);
            
            response.put("success", true);
            response.put("message", "Kursus berhasil dihapus");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Terjadi kesalahan internal: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PatchMapping("/courses/{id}/status")
    public ResponseEntity<Map<String, Object>> toggleCourseStatus(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Course course = courseService.toggleCourseStatus(id);
            response.put("success", true);
            response.put("message", "Status kursus berhasil diperbarui");
            response.put("data", course);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Terjadi kesalahan internal: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ===============================
    // MATERIAL MANAGEMENT ENDPOINTS
    // ===============================
    
    @PostMapping("/courses/{courseId}/materials")
    public ResponseEntity<Map<String, Object>> uploadMaterial(
            @PathVariable Long courseId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("type") String type) {

        Map<String, Object> response = new HashMap<>();
        try {
            Material material = courseService.uploadMaterial(courseId, file, title, description, type);
            response.put("success", true);
            response.put("message", "Materi berhasil diupload");
            response.put("data", material);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Terjadi kesalahan saat upload materi: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/courses/{courseId}/materials")
    public ResponseEntity<List<Material>> getCourseMaterials(@PathVariable Long courseId) {
        try {
            List<Material> materials = courseService.getCourseMaterials(courseId);
            return ResponseEntity.ok(materials);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/materials/{materialId}")
    public ResponseEntity<Map<String, Object>> deleteMaterial(@PathVariable Long materialId) {
        Map<String, Object> response = new HashMap<>();
        try {
            courseService.deleteMaterial(materialId);
            response.put("success", true);
            response.put("message", "Materi berhasil dihapus");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Terjadi kesalahan saat menghapus materi: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ===============================
    // ADDITIONAL COURSE ENDPOINTS
    // ===============================

    
    
    @GetMapping("/courses/popular")
    public ResponseEntity<List<Course>> getPopularCourses(@RequestParam(defaultValue = "5") int limit) {
        try {
            List<Course> courses = courseService.getPopularCourses(limit);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/courses/search")
    public ResponseEntity<Page<Course>> searchCourses(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Course> courses = courseService.searchCourses(query, pageable);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/courses/count")
    public ResponseEntity<Long> getCourseCount() {
        try {
            Long count = courseService.getCourseCount();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0L);
        }
    }

    @GetMapping("/courses/stats")
    public ResponseEntity<Map<String, Object>> getCourseStats() {
        try {
            Map<String, Object> stats = courseService.getCourseStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> emptyStats = new HashMap<>();
            emptyStats.put("totalCourses", 0);
            emptyStats.put("activeCourses", 0);
            emptyStats.put("totalEnrollments", 0);
            emptyStats.put("totalRevenue", 0);
            return ResponseEntity.ok(emptyStats);
        }
    }

    @GetMapping("/courses/by-category/{categoryId}")
    public ResponseEntity<Page<Course>> getCoursesByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Course> courses = courseService.getCoursesByCategory(categoryId, pageable);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // ===============================
    // PRIVATE HELPER METHODS
    // ===============================

    /**
     * Upload gambar ke server dan return URL
     */
    private String uploadImage(MultipartFile imageFile) throws IOException {
        // Tentukan folder penyimpanan
        String uploadDir = "uploads/images/";
        Path uploadPath = Paths.get(uploadDir);
        
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate nama file unik
        String originalFilename = imageFile.getOriginalFilename();
        String extension = originalFilename != null ? 
            originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
        String filename = UUID.randomUUID() + extension;
        
        // Simpan file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return URL lengkap yang bisa diakses dari frontend
        return "http://localhost:8080/uploads/images/" + filename;
    }

    /**
     * Hapus gambar lama dari server
     */
    private void deleteOldImage(String imageUrl) {
        if (imageUrl != null && imageUrl.contains("/uploads/images/")) {
            try {
                String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
                Path filePath = Paths.get("uploads/images/" + filename);
                Files.deleteIfExists(filePath);
            } catch (Exception e) {
                System.err.println("Gagal menghapus gambar lama: " + e.getMessage());
            }
        }
    }
}