package com.kursus.backend.controller;

import com.kursus.backend.model.User;
import com.kursus.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Tambahkan CORS support
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Validasi input
            if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Username tidak boleh kosong");
            }
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email tidak boleh kosong");
            }
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password tidak boleh kosong");
            }

            boolean success = authService.register(
                user.getUsername(),
                user.getPassword(),
                user.getEmail()
            );
            
            if (success) {
                // Return JSON response untuk konsistensi
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Registrasi berhasil");
                response.put("username", user.getUsername());
                response.put("email", user.getEmail());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Registrasi gagal - Username atau email sudah digunakan");
            }
        } catch (Exception e) {
            System.err.println("Error during registration: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Terjadi kesalahan saat registrasi: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            // Validasi input
            if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Username tidak boleh kosong");
            }
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password tidak boleh kosong");
            }

            boolean success = authService.login(user.getUsername(), user.getPassword());
            
            if (success) {
                // Return JSON response dengan data user (untuk frontend yang lebih advanced)
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login berhasil");
                response.put("token", "jwt-token-" + System.currentTimeMillis()); // Simulasi JWT token
                
                Map<String, Object> userData = new HashMap<>();
                userData.put("username", user.getUsername());
                userData.put("email", user.getUsername() + "@example.com"); // Simulasi email
                response.put("user", userData);
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body("Username atau password salah");
            }
        } catch (Exception e) {
            System.err.println("Error during login: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Terjadi kesalahan saat login: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        try {
            authService.logout();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Logout berhasil");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error during logout: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Terjadi kesalahan saat logout: " + e.getMessage());
        }
    }

    // Endpoint tambahan untuk mendapatkan info user (opsional)
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            // Implementasi sederhana - di production harus validate JWT token
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User authenticated");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Token tidak valid");
        }
    }
}