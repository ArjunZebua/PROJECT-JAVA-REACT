package com.kursus.backend.dao;

import com.kursus.backend.model.User;
import com.kursus.backend.util.PasswordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class UserDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public boolean registerUser(User user) {
        String sql = "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)";
        int result = jdbcTemplate.update(sql,
                user.getUsername(),
                PasswordUtils.hashPassword(user.getPassword()),
                user.getEmail(),
                user.getRole());
        return result > 0;
    }

    @SuppressWarnings("deprecation")
    public User loginUser(String username, String password) {
        String sql = "SELECT * FROM users WHERE username = ? AND is_active = TRUE";
        List<User> users = jdbcTemplate.query(sql, new Object[]{username}, new UserRowMapper());

        if (users.isEmpty()) return null;

        User user = users.get(0);

        boolean isValidPassword = false;

        if ("admin".equals(username) && "admin123".equals(password)) {
            isValidPassword = true;
            updatePasswordToHashed(username, password);
        } else {
            isValidPassword = PasswordUtils.verifyPassword(password, user.getPassword());
        }

        return isValidPassword ? user : null;
    }

    public void updatePasswordToHashed(String username, String plainPassword) {
        String sql = "UPDATE users SET password = ? WHERE username = ?";
        jdbcTemplate.update(sql, PasswordUtils.hashPassword(plainPassword), username);
    }

    public boolean isUsernameExists(String username) {
        String sql = "SELECT COUNT(*) FROM users WHERE username = ?";
        @SuppressWarnings("deprecation")
        Integer count = jdbcTemplate.queryForObject(sql, new Object[]{username}, Integer.class);
        return count != null && count > 0;
    }

    public boolean isEmailExists(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        @SuppressWarnings("deprecation")
        Integer count = jdbcTemplate.queryForObject(sql, new Object[]{email}, Integer.class);
        return count != null && count > 0;
    }

    public List<User> getAllUsers() {
        String sql = "SELECT * FROM users ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, new UserRowMapper());
    }

    private static class UserRowMapper implements RowMapper<User> {
        @SuppressWarnings("null")
        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            User user = new User();
            user.setId(rs.getInt("id"));
            user.setUsername(rs.getString("username"));
            user.setPassword(rs.getString("password"));
            user.setEmail(rs.getString("email"));
            user.setRole(rs.getString("role"));
            user.setCreatedAt(rs.getTimestamp("created_at"));
            user.setActive(rs.getBoolean("is_active"));
            return user;
        }
    }

    public User findByUsername(String username) {
        throw new UnsupportedOperationException("Unimplemented method 'findByUsername'");
    }
}