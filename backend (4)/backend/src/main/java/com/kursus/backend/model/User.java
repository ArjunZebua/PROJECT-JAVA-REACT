// package com.kursus.backend.model;

// import java.sql.Timestamp;

// public class User {
//     private int id;
//     private String username;
//     private String password;
//     private String email;
//     private String role;
//     private Timestamp createdAt;
//     private boolean isActive;
    
//     // Constructors
//     public User() {}
    
//     public User(String username, String password, String email) {
//         this.username = username;
//         this.password = password;
//         this.email = email;
//         this.role = "user";
//         this.isActive = true;
//     }
    
//     // Getters and Setters
//     public int getId() { return id; }
//     public void setId(int id) { this.id = id; }
    
//     public String getUsername() { return username; }
//     public void setUsername(String username) { this.username = username; }
    
//     public String getPassword() { return password; }
//     public void setPassword(String password) { this.password = password; }
    
//     public String getEmail() { return email; }
//     public void setEmail(String email) { this.email = email; }
    
//     public String getRole() { return role; }
//     public void setRole(String role) { this.role = role; }
    
//     public Timestamp getCreatedAt() { return createdAt; }
//     public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    
//     public boolean isActive() { return isActive; }
//     public void setActive(boolean active) { isActive = active; }
    
//     @Override
//     public String toString() {
//         return "User{" +
//                 "id=" + id +
//                 ", username='" + username + '\'' +
//                 ", email='" + email + '\'' +
//                 ", role='" + role + '\'' +
//                 ", createdAt=" + createdAt +
//                 ", isActive=" + isActive +
//                 '}';
//     }
// }


package com.kursus.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tambahan field username
    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column
    private String phone;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "is_active")
    private Boolean isActive = true;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Enrollment> enrollments;

    public enum Role {
        USER, ADMIN, INSTRUCTOR
    }

    // Constructors
    public User() {}

    public User(String username, String email, String password, String firstName, String lastName, Role role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public List<Enrollment> getEnrollments() { return enrollments; }
    public void setEnrollments(List<Enrollment> enrollments) { this.enrollments = enrollments; }

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
