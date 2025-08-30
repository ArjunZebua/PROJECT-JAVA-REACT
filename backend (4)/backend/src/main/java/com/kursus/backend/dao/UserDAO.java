package com.kursus.backend.dao;

import com.kursus.backend.model.User;
import com.kursus.backend.util.PasswordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.Streamable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@SuppressWarnings("unused")
@Repository
public class UserDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private PasswordUtils passwordUtils;

    public boolean registerUser(User user) {
        String sql = "INSERT INTO users (username, password, email, role, created_at, updated_at, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)";
        int result = jdbcTemplate.update(sql,
                user.getUsername(),
                passwordUtils.hashPassword(user.getPassword()), // Changed from static call
                user.getEmail(),
                user.getRole().name(), // Convert enum to String
                LocalDateTime.now(),
                LocalDateTime.now(),
                true);
        return result > 0;
    }

    public User loginUser(String username, String password) {
        String sql = "SELECT * FROM users WHERE username = ? AND is_active = TRUE";
        List<User> users = jdbcTemplate.query(sql, new UserRowMapper(), username);

        if (users.isEmpty()) return null;

        User user = users.get(0);

        boolean isValidPassword = false;

        // Special handling for default admin
        if ("admin".equals(username) && "admin123".equals(password)) {
            isValidPassword = true;
            updatePasswordToHashed(username, password);
        } else {
            isValidPassword = passwordUtils.verifyPassword(password, user.getPassword()); // Changed from static call
        }

        return isValidPassword ? user : null;
    }

    public void updatePasswordToHashed(String username, String plainPassword) {
        String sql = "UPDATE users SET password = ?, updated_at = ? WHERE username = ?";
        jdbcTemplate.update(sql, 
            passwordUtils.hashPassword(plainPassword), // Changed from static call
            LocalDateTime.now(),
            username);
    }

    public boolean isUsernameExists(String username) {
        String sql = "SELECT COUNT(*) FROM users WHERE username = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username);
        return count != null && count > 0;
    }

    public boolean isEmailExists(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    public List<User> getAllUsers() {
        String sql = "SELECT * FROM users ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, new UserRowMapper());
    }

    public User findByUsername(String username) {
        String sql = "SELECT * FROM users WHERE username = ?";
        List<User> users = jdbcTemplate.query(sql, new UserRowMapper(), username);
        return users.isEmpty() ? null : users.get(0);
    }

    public User findById(Long id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        List<User> users = jdbcTemplate.query(sql, new UserRowMapper(), id);
        return users.isEmpty() ? null : users.get(0);
    }

    public boolean updateUser(User user) {
        String sql = "UPDATE users SET username = ?, email = ?, role = ?, updated_at = ?, is_active = ? WHERE id = ?";
        int result = jdbcTemplate.update(sql,
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                LocalDateTime.now(),
                user.isActive(),
                user.getId());
        return result > 0;
    }

    public boolean deleteUser(Long id) {
        String sql = "DELETE FROM users WHERE id = ?";
        int result = jdbcTemplate.update(sql, id);
        return result > 0;
    }

    public boolean deactivateUser(Long id) {
        String sql = "UPDATE users SET is_active = FALSE, updated_at = ? WHERE id = ?";
        int result = jdbcTemplate.update(sql, LocalDateTime.now(), id);
        return result > 0;
    }

    public boolean activateUser(Long id) {
        String sql = "UPDATE users SET is_active = TRUE, updated_at = ? WHERE id = ?";
        int result = jdbcTemplate.update(sql, LocalDateTime.now(), id);
        return result > 0;
    }

    public List<User> findUsersByRole(User.Role role) {
        String sql = "SELECT * FROM users WHERE role = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, new UserRowMapper(), role.name());
    }

    public List<User> findActiveUsers() {
        String sql = "SELECT * FROM users WHERE is_active = TRUE ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, new UserRowMapper());
    }

    private static class UserRowMapper implements RowMapper<User> {
        @SuppressWarnings("null")
        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            User user = new User();
            
            // Set ID (convert int to Long)
            user.setId((long) rs.getInt("id"));
            
            // Set basic fields
            user.setUsername(rs.getString("username"));
            user.setPassword(rs.getString("password"));
            user.setEmail(rs.getString("email"));
            
            // Set role (convert String to enum)
            String roleString = rs.getString("role");
            if (roleString != null) {
                try {
                    user.setRole(User.Role.valueOf(roleString.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    user.setRole(User.Role.USER); // default fallback
                }
            } else {
                user.setRole(User.Role.USER); // default if null
            }
            
            // Set timestamps (convert Timestamp to LocalDateTime)
            if (rs.getTimestamp("created_at") != null) {
                user.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            }
            
            if (rs.getTimestamp("updated_at") != null) {
                user.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
            }
            
            // Set active status
            user.setActive(rs.getBoolean("is_active"));
            
            return user;
        }
    }

    public Page<User> findAll(Pageable pageable) {
    String sql = "SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?";
    List<User> users = jdbcTemplate.query(
        sql,
        new UserRowMapper(),
        pageable.getPageSize(),
        pageable.getOffset()
    );

    String countSql = "SELECT COUNT(*) FROM users";
    Long total = jdbcTemplate.queryForObject(countSql, Long.class);

    return new org.springframework.data.domain.PageImpl<>(users, pageable, total != null ? total : 0);
}


    public boolean existsByEmail(String email) {
        return isEmailExists(email); // Use existing method
    }

public User save(User user) {
    if (user.getId() == null) {
        // INSERT
        String sql = "INSERT INTO users (username, password, email, role, created_at, updated_at, is_active) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getUsername());
            ps.setString(2, passwordUtils.hashPassword(user.getPassword()));
            ps.setString(3, user.getEmail());
            ps.setString(4, user.getRole().name());
            ps.setObject(5, LocalDateTime.now());
            ps.setObject(6, LocalDateTime.now());
            ps.setBoolean(7, user.isActive());
            return ps;
        }, keyHolder);

        // ambil id dari hasil insert
        Number key = keyHolder.getKey();
        if (key != null) {
            user.setId(key.longValue());
        }

    } else {
        // UPDATE
        String sql = "UPDATE users SET username = ?, email = ?, role = ?, updated_at = ?, is_active = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                LocalDateTime.now(),
                user.isActive(),
                user.getId());
    }
    return user;
}


    public Page<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String query, String query2, String query3, Pageable pageable) {
        throw new UnsupportedOperationException("Unimplemented method 'findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase'");
    }

    public long count() {
        String sql = "SELECT COUNT(*) FROM users";
        Long count = jdbcTemplate.queryForObject(sql, Long.class);
        return count != null ? count : 0;
    }

    public long countByIsActive(boolean isActive) {
        String sql = "SELECT COUNT(*) FROM users WHERE is_active = ?";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, isActive);
        return count != null ? count : 0;
    }

    public long countByCreatedAtAfter(LocalDateTime dateTime) {
        String sql = "SELECT COUNT(*) FROM users WHERE created_at > ?";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, dateTime);
        return count != null ? count : 0;
    }

    public Streamable<User> findByEmailAndIsActive(String email, boolean isActive) {
        String sql = "SELECT * FROM users WHERE email = ? AND is_active = ?";
        List<User> users = jdbcTemplate.query(sql, new UserRowMapper(), email, isActive);
        return Streamable.of(users);
    }
}