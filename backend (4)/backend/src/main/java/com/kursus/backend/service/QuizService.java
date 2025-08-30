package com.kursus.backend.service;

import com.kursus.backend.model.Question;
import com.kursus.backend.model.QuizResult;
import com.kursus.backend.repository.QuestionRepository;
import com.kursus.backend.repository.QuizResultRepository;
import com.kursus.backend.DTO.QuizSubmissionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class QuizService {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private QuizResultRepository quizResultRepository;
    
    public Map<String, Object> submitQuiz(QuizSubmissionDTO submission) {
        Map<String, Object> result = new HashMap<>();
        
        int score = 0;
        int totalQuestions = submission.getAnswers().size();
        Map<Long, Boolean> questionResults = new HashMap<>();
        
        // Calculate score
        for (Map.Entry<Long, Integer> answer : submission.getAnswers().entrySet()) {
            Long questionId = answer.getKey();
            Integer selectedAnswer = answer.getValue();
            
            Question question = questionRepository.findById(questionId).orElse(null);
            if (question != null) {
                boolean isCorrect = question.getCorrectAnswer().equals(selectedAnswer);
                questionResults.put(questionId, isCorrect);
                if (isCorrect) {
                    score++;
                }
            }
        }
        
        // Save quiz result
        QuizResult quizResult = new QuizResult(
            submission.getUserName(),
            score,
            totalQuestions,
            LocalDateTime.now(),
            submission.getDuration()
        );
        quizResultRepository.save(quizResult);
        
        // Prepare response
        result.put("score", score);
        result.put("totalQuestions", totalQuestions);
        result.put("percentage", (double) score / totalQuestions * 100);
        result.put("questionResults", questionResults);
        result.put("passed", score >= (totalQuestions * 0.6)); // 60% passing score
        
        return result;
    }
    
    public List<QuizResult> getTopScores() {
        return quizResultRepository.findTopScores();
    }
    
    public List<QuizResult> getUserResults(String userName) {
        return quizResultRepository.findByUserName(userName);
    }
    
    public Double getUserAverageScore(String userName) {
        return quizResultRepository.findAverageScoreByUser(userName);
    }
}