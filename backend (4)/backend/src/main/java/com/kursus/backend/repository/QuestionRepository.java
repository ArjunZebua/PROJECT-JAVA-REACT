package com.kursus.backend.repository;

import com.kursus.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Random semua pertanyaan
    @Query(value = "SELECT * FROM questions ORDER BY RANDOM() LIMIT ?1", nativeQuery = true)
    List<Question> findRandomQuestions(int limit);

    // Random pertanyaan per kategori
    @Query(value = "SELECT * FROM questions WHERE category = ?1 ORDER BY RANDOM() LIMIT ?2", nativeQuery = true)
    List<Question> findRandomQuestionsByCategory(String category, int limit);

    List<Question> findByCategory(Question.Category category);

    List<Question> findByDifficulty(Integer difficulty);
}

