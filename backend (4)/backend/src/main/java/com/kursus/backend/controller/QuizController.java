package com.kursus.backend.controller;

import com.kursus.backend.service.QuestionService;
import com.kursus.backend.service.QuizService;
import com.kursus.backend.model.Question;
import com.kursus.backend.model.QuizResult;
import com.kursus.backend.DTO.QuestionDTO;
import com.kursus.backend.DTO.QuizSubmissionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "*")
public class QuizController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private QuizService quizService;

    @GetMapping("/questions")
    public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
        List<QuestionDTO> questions = questionService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/questions/random")
    public ResponseEntity<List<QuestionDTO>> getRandomQuestions(@RequestParam(defaultValue = "10") Integer limit) {
        List<QuestionDTO> questions = questionService.getRandomQuestions(limit);
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/questions/category/{category}")
    public ResponseEntity<List<QuestionDTO>> getQuestionsByCategory(@PathVariable String category) {
        try {
            Question.Category cat = Question.Category.valueOf(category.toUpperCase());
            List<QuestionDTO> questions = questionService.getQuestionsByCategory(cat);
            return ResponseEntity.ok(questions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/questions/difficulty/{difficulty}")
    public ResponseEntity<List<QuestionDTO>> getQuestionsByDifficulty(@PathVariable Integer difficulty) {
        List<QuestionDTO> questions = questionService.getQuestionsByDifficulty(difficulty);
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/questions/{id}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long id) {
        try {
            QuestionDTO question = questionService.getQuestionDTOById(id);
            return ResponseEntity.ok(question);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitQuiz(@RequestBody QuizSubmissionDTO submission) {
        try {
            Map<String, Object> result = quizService.submitQuiz(submission);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<QuizResult>> getLeaderboard() {
        List<QuizResult> topScores = quizService.getTopScores();
        return ResponseEntity.ok(topScores);
    }

    @GetMapping("/results/{userName}")
    public ResponseEntity<List<QuizResult>> getUserResults(@PathVariable String userName) {
        List<QuizResult> results = quizService.getUserResults(userName);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/average/{userName}")
    public ResponseEntity<Double> getUserAverageScore(@PathVariable String userName) {
        Double average = quizService.getUserAverageScore(userName);
        return ResponseEntity.ok(average != null ? average : 0.0);
    }

    @PostMapping("/questions")
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        Question savedQuestion = questionService.saveQuestion(question);
        return ResponseEntity.ok(savedQuestion);
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        try {
            Question updatedQuestion = questionService.updateQuestion(id, question);
            return ResponseEntity.ok(updatedQuestion);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        try {
            questionService.deleteQuestion(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}