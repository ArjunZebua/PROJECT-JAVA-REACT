package com.kursus.backend.DTO;

import com.kursus.backend.model.Question.Category;
import java.util.List;

public class QuestionDTO {
    private Long id;
    private String questionText;
    private List<String> options;
    private String explanation;
    private Category category;
    private Integer difficulty;
    
    // Constructor
    public QuestionDTO() {}
    
    public QuestionDTO(Long id, String questionText, List<String> options, String explanation, Category category, Integer difficulty) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.explanation = explanation;
        this.category = category;
        this.difficulty = difficulty;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
    
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    
    public Integer getDifficulty() { return difficulty; }
    public void setDifficulty(Integer difficulty) { this.difficulty = difficulty; }
}
