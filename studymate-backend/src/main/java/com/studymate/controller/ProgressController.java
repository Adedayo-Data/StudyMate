package com.studymate.controller;

import com.studymate.api.dto.UserProgressDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @GetMapping("/me")
    public ResponseEntity<UserProgressDto> me() {
        UserProgressDto p = new UserProgressDto();
        p.userId = "demo-user";
        p.totalCoursesEnrolled = 3;
        p.completedCourses = 1;
        p.totalLessonsCompleted = 12;
        p.totalStudyHours = 25;
        p.currentStreak = 5;
        p.longestStreak = 10;
        p.averageScore = 82.5;
        return ResponseEntity.ok(p);
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> dashboard() {
        return ResponseEntity.ok(Map.of(
                "activeCourses", 3,
                "studyStreak", 5,
                "completedLessons", 12,
                "totalStudyHours", 25
        ));
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<Map<String, Object>> courseProgress(@PathVariable String courseId) {
        return ResponseEntity.ok(Map.of("progress", 42));
    }

    @PostMapping("/study-session")
    public ResponseEntity<Void> logStudySession(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok().build();
    }
}
