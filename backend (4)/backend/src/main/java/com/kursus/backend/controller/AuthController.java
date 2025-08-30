package com.kursus.backend.controller;

import com.kursus.backend.model.User;
import com.kursus.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        // validasi input
        if (user.getUsername() == null || user.getPassword() == null)
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Username & password required"));

        Map<String, Object> result = authService.login(user.getUsername(), user.getPassword());
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(401).body(result);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.registerUserOnly(user.getUsername(), user.getPassword(), user.getEmail(), user.getFirstName(), user.getLastName()));
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of("message", "API is running"));
    }
}
