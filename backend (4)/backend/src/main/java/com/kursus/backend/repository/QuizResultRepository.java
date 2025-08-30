package com.kursus.backend.repository;

import com.kursus.backend.model.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    
    List<QuizResult> findByUserName(String userName);
    
    @Query("SELECT qr FROM QuizResult qr WHERE qr.completedAt BETWEEN :startDate AND :endDate ORDER BY qr.score DESC")
    List<QuizResult> findTopScoresByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT qr FROM QuizResult qr ORDER BY qr.score DESC, qr.duration ASC LIMIT 10")
    List<QuizResult> findTopScores();
    
    @Query("SELECT AVG(qr.score) FROM QuizResult qr WHERE qr.userName = :userName")
    Double findAverageScoreByUser(@Param("userName") String userName);
}