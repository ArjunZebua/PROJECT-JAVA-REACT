package com.kursus.backend.service;

// import com.kursus.backend.UserStats;
import com.kursus.backend.dao.UserDAO;
import com.kursus.backend.model.User;
import com.kursus.backend.repository.UserRepository;
import com.kursus.backend.util.PasswordUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@SuppressWarnings("unused")
@Service
public class UserService {

    private final UserDAO userDAO;
    private final PasswordEncoder passwordUtils;
    private final EmailService emailService;
    private final UserRepository userRepository;

    public UserService(UserDAO userDAO, PasswordEncoder passwordUtils, EmailService emailService, UserRepository userRepository) {
        this.userDAO = userDAO;
        this.passwordUtils = passwordUtils;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    public Page<User> getAllUsers(Pageable pageable) {
        return userDAO.findAll(pageable);
    }

    public User getUserById(Long id) {
        return userDAO.findById(id);
    }

public User createUser(User user) {
    if (userRepository.existsByEmail(user.getEmail())) {
        throw new IllegalArgumentException("Email already exists");
    }

    User newUser = new User();
    newUser.setUsername(user.getUsername());
    newUser.setPassword(passwordUtils.encode(user.getPassword()));
    newUser.setEmail(user.getEmail());
    newUser.setFirstName(user.getFirstName());
    newUser.setLastName(user.getLastName());
    newUser.setPhone(user.getPhone());
    // newUser.setRole(user.getRole());
    newUser.setActive(true);

    newUser.setCreatedAt(LocalDateTime.now());
    newUser.setUpdatedAt(LocalDateTime.now());

    return userRepository.save(newUser);
}

    public User updateUser(Long id, User userDetails) {
        User user = userDAO.findById(id);

        if (!user.getEmail().equals(userDetails.getEmail()) &&
                userDAO.existsByEmail(userDetails.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setPhone(userDetails.getPhone());
        user.setUpdatedAt(LocalDateTime.now());

        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordUtils.encode(userDetails.getPassword()));
        }

        User updatedUser = userDAO.save(user);
        emailService.sendAccountUpdateNotification(updatedUser);

        return updatedUser;
    }

    public void deleteUser(Long id) {
        User user = userDAO.findById(id);

        user.setActive(false); // ✅ diganti dari setIsActive
        user.setUpdatedAt(LocalDateTime.now());
        userDAO.save(user);

        emailService.sendAccountDeactivationNotification(user);
    }

    public User toggleUserStatus(Long id) {
        User user = userDAO.findById(id);

        user.setActive(!user.getActive()); // ✅ diganti dari getIsActive / setIsActive
        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userDAO.save(user);

        if (updatedUser.getActive()) { // ✅ diganti dari getIsActive
            emailService.sendAccountReactivationNotification(updatedUser);
        } else {
            emailService.sendAccountDeactivationNotification(updatedUser);
        }

        return updatedUser;
    }

    public Page<User> searchUsers(String query, Pageable pageable) {
        return userDAO.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                query, query, query, pageable);
    }

    public long getUserCount() {
        return userDAO.count();
    }

    // public UserStats getUserStats() {
    //     long totalUsers = userDAO.count();
    //     long activeUsers = userDAO.countByIsActive(true);   // ✅ ini sesuai DAO
    //     long inactiveUsers = userDAO.countByIsActive(false); // ✅ hitung yg tidak aktif
    //     long newUsersThisMonth = userDAO.countByCreatedAtAfter(LocalDateTime.now().minusMonths(1));

    //     return new UserStats(totalUsers, activeUsers, inactiveUsers, newUsersThisMonth);
    // }
}
