package com.studymate.api.dto;

public class AssignmentDto {
    public String id;
    public String courseId;
    public String title;
    public String description;
    public String dueDate;
    public int maxScore;
    public String status; // PENDING | SUBMITTED | GRADED
    public String submittedAt;
    public Integer score;
    public String feedback;
}
