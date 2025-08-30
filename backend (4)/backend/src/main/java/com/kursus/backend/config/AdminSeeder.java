package com.kursus.backend.config;

import com.kursus.backend.model.User;
import com.kursus.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List; // ADD THIS IMPORT
import java.util.Optional;

@SuppressWarnings("unused")
@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            // Hapus admin duplikat jika ada
            cleanupDuplicateAdmins();
            
            // Cek apakah admin sudah ada berdasarkan username DAN email
            boolean adminExistsByUsername = userRepository.existsByUsername("admin");
            boolean adminExistsByEmail = userRepository.existsByEmail("admin@system.com");
            
            System.out.println("🔍 Checking admin existence...");
            System.out.println("Admin exists by username: " + adminExistsByUsername);
            System.out.println("Admin exists by email: " + adminExistsByEmail);
            
            if (!adminExistsByUsername && !adminExistsByEmail) {
                // Buat admin baru jika benar-benar tidak ada
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@system.com");
                admin.setRole(User.Role.ADMIN);
                admin.setPassword(passwordEncoder.encode("admin1234"));
                admin.setActive(true);
                admin.setFirstName("System");
                admin.setLastName("Admin");

                User savedAdmin = userRepository.save(admin);
                System.out.println("✅ Admin baru berhasil dibuat!");
                System.out.println("Username: " + savedAdmin.getUsername());
                System.out.println("Email: " + savedAdmin.getEmail());
                System.out.println("Role: " + savedAdmin.getRole());
                System.out.println("Password: admin1234");
                
            // } else {
            //     // Admin sudah ada, update password dan role untuk memastikan konsistensi
            //     System.out.println("ℹ️ Admin sudah ada, melakukan update...");
                
            //     Optional<User> existingAdminOpt = userRepository.findByUsername("admin");
            //     if (existingAdminOpt.isEmpty()) {
            //         // Jika tidak ditemukan by username, cari by email
            //         existingAdminOpt = userRepository.findByEmail("admin@system.com");
            //     }
                
            //     if (existingAdminOpt.isPresent()) {
            //         User existingAdmin = existingAdminOpt.get();
                    
            //         // Update data admin untuk memastikan konsistensi
            //         existingAdmin.setUsername("admin");
            //         existingAdmin.setEmail("admin@system.com");
            //         existingAdmin.setRole(User.Role.ADMIN);
            //         existingAdmin.setPassword(passwordEncoder.encode("admin1234"));
            //         existingAdmin.setActive(true);
            //         existingAdmin.setFirstName("System");
            //         existingAdmin.setLastName("Admin");
                    
            //         User updatedAdmin = userRepository.save(existingAdmin);
            //         System.out.println("✅ Admin berhasil diupdate!");
            //         System.out.println("Username: " + updatedAdmin.getUsername());
            //         System.out.println("Email: " + updatedAdmin.getEmail());
            //         System.out.println("Role: " + updatedAdmin.getRole());
            //         System.out.println("Password: admin1234 (updated)");
            //     } else {
            //         System.err.println("❌ Admin exists check returned true but admin not found!");
            //     }
            }
            
            // Buat user test untuk memastikan login user biasa juga bekerja
            createTestUserIfNotExists();
            
            // Tampilkan statistik
            long totalUsers = userRepository.count();
            System.out.println("📊 Total users in database: " + totalUsers);
            
        } catch (Exception e) {
            System.err.println("❌ Error in AdminSeeder: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void cleanupDuplicateAdmins() {
        try {
            // Hapus semua admin kecuali yang pertama
            List<User> admins = userRepository.findByRole(User.Role.ADMIN);
            if (admins.size() > 1) {
                System.out.println("⚠️ Found " + admins.size() + " admin accounts. Keeping only the first one.");
                for (int i = 1; i < admins.size(); i++) {
                    userRepository.delete(admins.get(i));
                    System.out.println("Deleted duplicate admin: " + admins.get(i).getUsername());
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Error cleaning duplicate admins: " + e.getMessage());
        }
    }
    
    private void createTestUserIfNotExists() {
        try {
            if (!userRepository.existsByUsername("testuser")) {
                User testUser = new User();
                testUser.setUsername("testuser");
                testUser.setEmail("test@example.com");
                testUser.setPassword(passwordEncoder.encode("test123")); // BCrypt
                testUser.setRole(User.Role.USER);
                testUser.setActive(true);
                testUser.setFirstName("Test");
                testUser.setLastName("User");
                
                userRepository.save(testUser);
                System.out.println("✅ Test user created!");
                System.out.println("Username: testuser");
                System.out.println("Password: test123");
            }
        } catch (Exception e) {
            System.err.println("❌ Error creating test user: " + e.getMessage());
        }
    }
}