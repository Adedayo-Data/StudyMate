package com.studymate.api.dto;

import java.util.List;

public class StudyPlanDto {
    public String id;
    public String userId;
    public String title;
    public String description;
    public String targetDate;
    public List<String> courses; // ids
    public int dailyStudyHours;
    public int progress; // percentage
    public String status; // ACTIVE | COMPLETED | PAUSED
    public String createdAt;
}
