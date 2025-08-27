package com.studymate.api.dto;

public class LessonDto {
    public String id;
    public String courseId;
    public String title;
    public String description;
    public String content;
    public String videoUrl;
    public int duration; // minutes
    public int order; // order index
    public Boolean isCompleted;
}
