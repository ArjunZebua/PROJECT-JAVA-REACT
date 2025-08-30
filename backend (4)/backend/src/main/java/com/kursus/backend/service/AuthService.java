package com.kursus.backend.service;

import com.kursus.backend.model.User;
import com.kursus.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ Keep for backward compatibility, but also use Spring Security
    private User currentUser;

    // ===========================
    // LOGIN WITH SPRING SECURITY INTEGRATION
    // ===========================
    public Map<String, Object> login(String username, String password) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("=== AuthService.login() START ===");
            System.out.println("Input username: '" + username + "'");
            System.out.println("Input password length: " + (password != null ? password.length() : "null"));
            
            if (username == null || username.trim().isEmpty()) {
                System.out.println("ERROR: Username is null or empty");
                response.put("success", false);
                response.put("message", "Username tidak boleh kosong");
                return response;
            }
            
            if (password == null || password.trim().isEmpty()) {
                System.out.println("ERROR: Password is null or empty");
                response.put("success", false);
                response.put("message", "Password tidak boleh kosong");
                return response;
            }

            // Find user by username OR email (seragam dengan code lama)
            System.out.println("Searching for user with username: '" + username.trim() + "'");
            Optional<User> userOpt = userRepository.findByUsername(username.trim())
                .or(() -> userRepository.findByEmail(username.trim()));
            
            if (userOpt.isEmpty()) {
                System.out.println("ERROR: User not found in database");
                
                // Debug: Check if username exists (seragam dengan code lama)
                boolean usernameExists = userRepository.existsByUsername(username.trim());
                System.out.println("Username exists check: " + usernameExists);
                
                response.put("success", false);
                response.put("message", "User tidak ditemukan");
                return response;
            }
            
            User user = userOpt.get();
            System.out.println("User found:");
            System.out.println("- ID: " + user.getId());
            System.out.println("- Username: '" + user.getUsername() + "'");
            System.out.println("- Email: '" + user.getEmail() + "'");
            System.out.println("- Active: " + user.getActive());
            System.out.println("- Role: " + user.getRole());
            System.out.println("- Password hash: " + (user.getPassword() != null ? user.getPassword().substring(0, Math.min(20, user.getPassword().length())) + "..." : "null"));
            
            if (!user.isActive()) {
                System.out.println("ERROR: User account is not active");
                response.put("success", false);
                response.put("message", "Akun tidak aktif");
                return response;
            }

            // Bandingkan password dengan BCrypt (seragam dengan code lama)
            System.out.println("Comparing passwords...");
            boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
            System.out.println("Password matches: " + passwordMatches);
            
            if (!passwordMatches) {
                System.out.println("ERROR: Password does not match");
                
                // Debug: Check if password is stored in plain text (seragam dengan code lama)
                boolean plainTextMatch = password.equals(user.getPassword());
                System.out.println("Plain text password match (for debug): " + plainTextMatch);
                
                response.put("success", false);
                response.put("message", "Password salah");
                return response;
            }
            
            // ✅ SET CURRENT USER (backward compatibility)
            this.currentUser = user;
            
            // ✅ CREATE SPRING SECURITY AUTHENTICATION (NEW - role-based security)
            String roleWithPrefix = "ROLE_" + user.getRole().name();
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority(roleWithPrefix);
            
            UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken(
                    user.getUsername(), 
                    null, // don't store password in auth
                    Collections.singletonList(authority)
                );
            
            // ✅ SET AUTHENTICATION IN SECURITY CONTEXT (NEW - enables role-based access)
            SecurityContextHolder.getContext().setAuthentication(authToken);
            
            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            System.out.println("SUCCESS: Login berhasil! Selamat datang, " + user.getUsername() + " (Role: " + user.getRole() + ")");
            System.out.println("✅ Security Context set with authority: " + roleWithPrefix);
            
            response.put("success", true);
            response.put("message", "Login berhasil");
            response.put("user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole().name(),
                "fullName", user.getFullName()
            ));
            
            return response;
            
        } catch (Exception e) {
            System.err.println("EXCEPTION in login(): " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Terjadi kesalahan saat login");
            return response;
        } finally {
            System.out.println("=== AuthService.login() END ===");
        }
    }

    // ✅ BACKWARD COMPATIBILITY - OLD LOGIN METHOD
    public boolean login(String username, String password, boolean legacy) {
        if (legacy) {
            Map<String, Object> result = login(username, password);
            return (Boolean) result.get("success");
        }
        return login(username, password) != null;
    }

    // ===========================
    // REGISTER USER ONLY - SERAGAM DENGAN CODE LAMA
    // ===========================
    public boolean registerUserOnly(String username, String password, String email, String firstName, String lastName) {
        try {
            System.out.println("=== AuthService.registerUserOnly() START ===");
            System.out.println("Username: '" + username + "'");
            System.out.println("Email: '" + email + "'");
            
            if (username == null || username.trim().isEmpty()) {
                System.out.println("ERROR: Username is null or empty");
                return false;
            }
            if (password == null || password.trim().isEmpty()) {
                System.out.println("ERROR: Encoded password is null or empty");
                return false;
            }
            if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                System.out.println("ERROR: Email is null or invalid format");
                return false;
            }

            // ❌ BLOKIR PENDAFTARAN ADMIN (seragam dengan code lama)
            String usernameLower = username.toLowerCase();
            String emailLower = email.toLowerCase();
            
            if (usernameLower.equals("admin") || usernameLower.contains("admin") || 
                emailLower.contains("admin@system.com") || emailLower.contains("admin")) {
                System.out.println("ERROR: Admin registration blocked for username: " + username);
                return false;
            }

            // Cek username/email sudah ada (seragam dengan code lama)
            System.out.println("Checking if username exists...");
            boolean usernameExists = userRepository.existsByUsername(username.trim());
            System.out.println("Username exists: " + usernameExists);
            
            if (usernameExists) {
                System.out.println("ERROR: Username already exists");
                return false;
            }
            
            System.out.println("Checking if email exists...");
            boolean emailExists = userRepository.existsByEmail(email.trim());
            System.out.println("Email exists: " + emailExists);
            
            if (emailExists) {
                System.out.println("ERROR: Email already exists");
                return false;
            }

            // Buat user baru (seragam dengan code lama)
            System.out.println("Creating new user...");
            System.out.println("Password hash preview: " + password.substring(0, Math.min(20, password.length())) + "...");
            
            User user = new User();
            user.setUsername(username.trim());
            user.setEmail(email.trim());
            user.setPassword(passwordEncoder.encode(password));
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setRole(User.Role.USER); // ✅ PAKSA ROLE USER
            user.setActive(true);

            System.out.println("Saving user to database...");
            User savedUser = userRepository.save(user);
            System.out.println("User saved with ID: " + savedUser.getId());
            
            System.out.println("SUCCESS: User registration berhasil!");
            System.out.println("- Username: " + savedUser.getUsername());
            System.out.println("- Email: " + savedUser.getEmail());
            System.out.println("- Role: " + savedUser.getRole());
            
            return true;
            
        } catch (Exception e) {
            System.err.println("EXCEPTION in registerUserOnly(): " + e.getMessage());
            e.printStackTrace();
            return false;
        } finally {
            System.out.println("=== AuthService.registerUserOnly() END ===");
        }
    }

public boolean registerWithEncodedPassword(String username, String rawPassword, String email, String firstName, String lastName) {
    try {
        System.out.println("=== registerWithEncodedPassword() START ===");
        System.out.println("Username: '" + username + "'");
        
        if (userRepository.existsByUsername(username) || userRepository.existsByEmail(email)) {
            System.out.println("User already exists");
            return false;
        }
        
        User user = new User();
        user.setUsername(username);
        user.setPassword(rawPassword); // encode sekali disini
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setActive(true);
        
        // Set role based on username (admin gets ADMIN role)
        if ("admin".equals(username)) {
            user.setRole(User.Role.ADMIN);
        } else {
            user.setRole(User.Role.USER);
        }
        
        userRepository.save(user);
        System.out.println("✅ User registered: " + username + " with role: " + user.getRole());
        return true;
        
    } catch (Exception e) {
        System.err.println("EXCEPTION in registerWithEncodedPassword(): " + e.getMessage());
        e.printStackTrace();
        return false;
    } finally {
        System.out.println("=== registerWithEncodedPassword() END ===");
    }
}
    // ✅ GET CURRENT USER FROM SPRING SECURITY
    public Map<String, Object> getCurrentUserFromSecurity() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
                return Map.of("success", false, "message", "Tidak ada user yang login");
            }
            
            String username = auth.getName();
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                return Map.of("success", false, "message", "User tidak ditemukan");
            }
            
            User user = userOpt.get();
            return Map.of(
                "success", true,
                "user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole().name(),
                    "fullName", user.getFullName()
                )
            );
            
        } catch (Exception e) {
            return Map.of("success", false, "message", "Error: " + e.getMessage());
        }
    }

    // ===========================
    // LOGOUT WITH SPRING SECURITY CLEANUP
    // ===========================
    public void logout() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null) {
                System.out.println("🚪 Logging out user: " + auth.getName());
            }
            
            // Clear Spring Security context
            SecurityContextHolder.clearContext();
            System.out.println("✅ Security context cleared");
            
            // Clear current user (backward compatibility)
            if (currentUser != null) {
                System.out.println("Logout berhasil. Sampai jumpa, " + currentUser.getUsername());
                currentUser = null;
            } else {
                System.out.println("No user currently logged in");
            }
            
        } catch (Exception e) {
            System.err.println("❌ Logout error: " + e.getMessage());
        }
    }

    // ===========================
    // BACKWARD COMPATIBILITY METHODS
    // ===========================
    public boolean isLoggedIn() {
        // Check both old way and Spring Security way
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return currentUser != null || (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal()));
    }

    public User getCurrentUser() {
        // Try Spring Security first, then fallback to currentUser
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            Optional<User> userOpt = userRepository.findByUsername(auth.getName());
            if (userOpt.isPresent()) {
                this.currentUser = userOpt.get(); // sync currentUser
                return userOpt.get();
            }
        }
        return currentUser;
    }

    public boolean isAdmin() {
        // Check using Spring Security authorities
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
        }
        // Fallback to old way
        return currentUser != null && User.Role.ADMIN.equals(currentUser.getRole());
    }

    public boolean isUser() {
        // Check using Spring Security authorities
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_USER"));
        }
        // Fallback to old way
        return currentUser != null && User.Role.USER.equals(currentUser.getRole());
    }

    // ✅ NEW METHOD - CHECK SPECIFIC ROLE
    public boolean hasRole(String roleName) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return false;
            }
            
            return auth.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_" + roleName));
                
        } catch (Exception e) {
            return false;
        }
    }

    // ===========================
    // DEBUG METHODS (SERAGAM DENGAN CODE LAMA)
    // ===========================
    public void debugUserInfo(String username) {
        try {
            System.out.println("=== DEBUG USER INFO: " + username + " ===");
            
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                System.out.println("User found:");
                System.out.println("- ID: " + user.getId());
                System.out.println("- Username: '" + user.getUsername() + "'");
                System.out.println("- Email: '" + user.getEmail() + "'");
                System.out.println("- Active: " + user.getActive());
                System.out.println("- Role: " + user.getRole());
                System.out.println("- First Name: " + user.getFirstName());
                System.out.println("- Last Name: " + user.getLastName());
                System.out.println("- Password hash length: " + (user.getPassword() != null ? user.getPassword().length() : "null"));
                System.out.println("- Password starts with $2: " + (user.getPassword() != null && user.getPassword().startsWith("$2")));
            } else {
                System.out.println("User not found");
            }
            
            System.out.println("==========================================");
        } catch (Exception e) {
            System.err.println("Error in debugUserInfo: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // ===========================
    // ADMIN CHECK METHODS (SERAGAM DENGAN CODE LAMA)
    // ===========================
    public long getTotalUsers() {
        return userRepository.count();
    }

    public long getTotalActiveUsers() {
        return userRepository.countByActiveTrue();
    }

    public boolean hasAdminUser() {
        return userRepository.existsByUsername("admin");
    }

    // // ===========================
    // // LEGACY METHODS - DEPRECATED BUT KEPT FOR COMPATIBILITY
    // // ===========================
    @Deprecated
    public boolean register(String username, String password, String email) {
        System.out.println("⚠️ Using deprecated register method. Use registerUserOnly instead.");
        String encodedPassword = passwordEncoder.encode(password);
        return registerUserOnly(username, encodedPassword, email, null, null);
    }
}