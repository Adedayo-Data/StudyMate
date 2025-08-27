package com.studymate.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "courses")
public class CourseEntity {
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(length = 4000)
    private String description;

    private String instructor;
    private String category;
    private String difficulty;
    @Column(name = "duration_hours", nullable = false)
    private Integer duration; // hours
    private Integer enrolledStudents;
    private Double rating;
    private String thumbnail;

    @Column(name = "is_published", nullable = false)
    private Boolean published = true;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (id == null) id = UUID.randomUUID();
        createdAt = OffsetDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    // getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    public Integer getEnrolledStudents() { return enrolledStudents; }
    public void setEnrolledStudents(Integer enrolledStudents) { this.enrolledStudents = enrolledStudents; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }
    public Boolean getPublished() { return published; }
    public void setPublished(Boolean published) { this.published = published; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
