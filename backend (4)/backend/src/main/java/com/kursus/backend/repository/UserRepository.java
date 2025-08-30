package com.kursus.backend.repository;

import com.kursus.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List; // ✅ TAMBAHKAN IMPORT INI untuk List
import java.util.Optional; // ✅ IMPORT INI SUDAH ADA

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    long countByActiveTrue();
    long countByCreatedAtAfter(LocalDateTime createdAt);

    @Query("SELECT COUNT(u) FROM User u WHERE u.active = true AND u.createdAt BETWEEN :start AND :end")
    long countActiveUsersBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    // ✅ SUDAH BENAR - return Optional
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.username = :username AND u.active = true")
    Optional<User> findActiveUserByUsername(@Param("username") String username);
    
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.active = true") 
    Optional<User> findActiveUserByEmail(@Param("email") String email);
    
    // ✅ TAMBAHKAN METHOD INI - dibutuhkan oleh AdminSeeder.java
    List<User> findByRole(User.Role role);
}