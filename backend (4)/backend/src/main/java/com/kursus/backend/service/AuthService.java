package com.kursus.backend.service;

import com.kursus.backend.dao.UserDAO;
import com.kursus.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserDAO userDAO;
    
    private User currentUser;
    
    public boolean register(String username, String password, String email) {
        if (username == null || username.trim().isEmpty()) {
            System.out.println("Username tidak boleh kosong!");
            return false;
        }
        
        if (password == null || password.length() < 6) {
            System.out.println("Password minimal 6 karakter!");
            return false;
        }
        
        if (email == null || !isValidEmail(email)) {
            System.out.println("Email tidak valid!");
            return false;
        }
        
        if (userDAO.isUsernameExists(username)) {
            System.out.println("Username sudah digunakan!");
            return false;
        }
        
        if (userDAO.isEmailExists(email)) {
            System.out.println("Email sudah digunakan!");
            return false;
        }
        
        User user = new User(username, password, email);
        boolean success = userDAO.registerUser(user);
        
        if (success) {
            System.out.println("Registrasi berhasil! Silakan login.");
        } else {
            System.out.println("Registrasi gagal! Coba lagi.");
        }
        
        return success;
    }
    
    public boolean login(String username, String password) {
        if (username == null || username.trim().isEmpty()) {
            System.out.println("Username tidak boleh kosong!");
            return false;
        }
        
        if (password == null || password.trim().isEmpty()) {
            System.out.println("Password tidak boleh kosong!");
            return false;
        }
        
        User user = userDAO.loginUser(username, password);
        
        if (user != null) {
            this.currentUser = user;
            System.out.println("Login berhasil! Selamat datang, " + user.getUsername());
            System.out.println("Role: " + user.getRole());
            return true;
        } else {
            System.out.println("Username atau password salah!");
            return false;
        }
    }
    
    public void logout() {
        if (currentUser != null) {
            System.out.println("Logout berhasil. Sampai jumpa, " + currentUser.getUsername());
            currentUser = null;
        }
    }
    
    public boolean isLoggedIn() {
        return currentUser != null;
    }
    
    public boolean isAdmin() {
        return currentUser != null && "admin".equals(currentUser.getRole());
    }
    
    public User getCurrentUser() {
        return currentUser;
    }
    
    private boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }

    public User register(User user) {
        throw new UnsupportedOperationException("Unimplemented method 'register'");
    }
}