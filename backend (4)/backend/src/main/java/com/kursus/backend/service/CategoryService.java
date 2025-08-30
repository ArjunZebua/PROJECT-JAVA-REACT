package com.kursus.backend.service;

import com.kursus.backend.model.Category;
import com.kursus.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Ambil semua kategori
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Ambil kategori berdasarkan ID
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    // Buat kategori baru
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Update kategori
    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id " + id));

        category.setName(categoryDetails.getName()); // pastikan Category.java punya field name
        category.setDescription(categoryDetails.getDescription()); // kalau ada field description

        return categoryRepository.save(category);
    }

    // Hapus kategori
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id " + id);
        }
        categoryRepository.deleteById(id);
    }

    public Category toggleCategoryStatus(Long id) {
        throw new UnsupportedOperationException("Unimplemented method 'toggleCategoryStatus'");
    }

    public Object getCategoryCount() {
        throw new UnsupportedOperationException("Unimplemented method 'getCategoryCount'");
    }
}
