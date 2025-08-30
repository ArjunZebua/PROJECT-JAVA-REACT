package com.kursus.backend.DTO;

import java.math.BigDecimal;

public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;   // ✅ gunakan BigDecimal
    private String level;       // ✅ field level ditambahkan
    private Integer duration;   // ✅ field duration ditambahkan
    private String imageUrl;
    private Boolean isActive;
    private Long categoryId;

    // Default constructor
    public CourseDTO() {}

    // Constructor dengan semua field
    public CourseDTO(Long id, String title, String description, BigDecimal price, String level, 
                     Integer duration, String imageUrl, Boolean isActive, Long categoryId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.level = level;
        this.duration = duration;
        this.imageUrl = imageUrl;
        this.isActive = isActive;
        this.categoryId = categoryId;
    }

    // Getter & Setter
    public Long getId() {return id;}
    public void setId(Long id) { this.id = id;}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    // ✅ Getter dan setter untuk level
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    // ✅ Getter dan setter untuk duration
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    @Override
    public String toString() {
        return "CourseDTO{" +
                "id='" + id + '\'' +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", level='" + level + '\'' +
                ", duration=" + duration +
                ", imageUrl='" + imageUrl + '\'' +
                ", isActive=" + isActive +
                ", categoryId=" + categoryId +
                '}';
    }
}