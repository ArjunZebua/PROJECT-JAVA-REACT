package com.kursus.backend.DTO;

import java.util.Map;

public class QuizSubmissionDTO {
    private String userName;
    private Map<Long, Integer> answers; // key = questionId, value = selectedOption (index jawaban yang dipilih)
    private Long duration; // lama pengerjaan quiz dalam detik

    // ✅ Constructor kosong (wajib untuk Jackson)
    public QuizSubmissionDTO() {}

    // ✅ Constructor dengan parameter
    public QuizSubmissionDTO(String userName, Map<Long, Integer> answers, Long duration) {
        this.userName = userName;
        this.answers = answers;
        this.duration = duration;
    }

    // ✅ Getter & Setter
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Map<Long, Integer> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, Integer> answers) {
        this.answers = answers;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }
}
