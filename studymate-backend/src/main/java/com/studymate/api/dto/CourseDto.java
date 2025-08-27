package com.studymate.api.dto;

public class CourseDto {
    public String id;
    public String title;
    public String description;
    public String instructor;
    public String category;
    public String difficulty; // BEGINNER | INTERMEDIATE | ADVANCED
    public int duration; // hours
    public int enrolledStudents;
    public double rating;
    public String thumbnail;
    public String createdAt;
    public String updatedAt;
}
