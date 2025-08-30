package com.kursus.backend.service;

import com.kursus.backend.model.Question;
import com.kursus.backend.repository.QuestionRepository;
import com.kursus.backend.DTO.QuestionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuestionService {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    public List<QuestionDTO> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<QuestionDTO> getRandomQuestions(Integer limit) {
        return questionRepository.findRandomQuestions(limit).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<QuestionDTO> getQuestionsByCategory(Question.Category category) {
        return questionRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<QuestionDTO> getQuestionsByDifficulty(Integer difficulty) {
        return questionRepository.findByDifficulty(difficulty).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<QuestionDTO> getRandomQuestionsByCategory(String category, Integer limit) {
        return questionRepository.findRandomQuestionsByCategory(category, limit).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // For internal use - returns Optional<Question>
    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }
    
    // For API use - returns QuestionDTO or throws exception
    public QuestionDTO getQuestionDTOById(Long id) {
        Optional<Question> question = questionRepository.findById(id);
        if (question.isPresent()) {
            return convertToDTO(question.get());
        }
        throw new RuntimeException("Question not found with id: " + id);
    }
    
    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }
    
    public Question updateQuestion(Long id, Question questionDetails) {
        Optional<Question> optionalQuestion = questionRepository.findById(id);
        
        if (optionalQuestion.isPresent()) {
            Question existingQuestion = optionalQuestion.get();
            
            // Update fields
            existingQuestion.setQuestionText(questionDetails.getQuestionText());
            existingQuestion.setOptions(questionDetails.getOptions());
            existingQuestion.setCorrectAnswer(questionDetails.getCorrectAnswer());
            existingQuestion.setExplanation(questionDetails.getExplanation());
            existingQuestion.setCategory(questionDetails.getCategory());
            existingQuestion.setDifficulty(questionDetails.getDifficulty());
            
            // Keep original creation date, set updated timestamp if you have that field
            // existingQuestion.setUpdatedAt(LocalDateTime.now());
            
            return questionRepository.save(existingQuestion);
        }
        
        throw new RuntimeException("Question not found with id: " + id);
    }
    
    public void deleteQuestion(Long id) {
        Optional<Question> question = questionRepository.findById(id);
        if (question.isPresent()) {
            questionRepository.deleteById(id);
        } else {
            throw new RuntimeException("Question not found with id: " + id);
        }
    }
    
    private QuestionDTO convertToDTO(Question question) {
        return new QuestionDTO(
            question.getId(),
            question.getQuestionText(),
            question.getOptions(),
            question.getExplanation(),
            question.getCategory(),
            question.getDifficulty()
        );
    }
}