package com.studymate.controller;

import com.studymate.api.dto.CourseDto;
import com.studymate.api.dto.LessonDto;
import com.studymate.api.dto.PageResponse;
import com.studymate.entity.CoursePdfEntity;
import com.studymate.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<CourseDto>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean enrolled
    ) {
        List<CourseDto> all = courseService.list(page, size, category);
        long total = courseService.count(category);
        int from = Math.min(page * size, all.size());
        int to = Math.min(from + size, all.size());
        List<CourseDto> slice = all.subList(from, to);
        return ResponseEntity.ok(new PageResponse<>(slice, total));
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<CourseDto> get(@PathVariable String courseId) {
        return courseService.get(courseId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<Void> enroll(@PathVariable String courseId) {
        // No-op for now
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{courseId}/lessons")
    public ResponseEntity<List<LessonDto>> lessons(@PathVariable String courseId) {
        // TODO: move lessons to DB; keeping sample behavior
        List<LessonDto> lessons = List.of();
        return ResponseEntity.ok(lessons);
    }

    @PostMapping("/{courseId}/lessons/{lessonId}/complete")
    public ResponseEntity<Void> completeLesson(@PathVariable String courseId, @PathVariable String lessonId) {
        // No-op for now
        return ResponseEntity.ok().build();
    }

    // Upload course PDF
    @PostMapping(path = "/{courseId}/pdf", consumes = "multipart/form-data")
    public ResponseEntity<Void> uploadPdf(@PathVariable String courseId, @RequestPart("file") MultipartFile file) throws Exception {
        courseService.uploadPdf(courseId, file);
        return ResponseEntity.ok().build();
    }

    // Download/stream course PDF
    @GetMapping(path = "/{courseId}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable String courseId) {
        Optional<CoursePdfEntity> pdf = courseService.getPdf(courseId);
        if (pdf.isEmpty()) return ResponseEntity.notFound().build();
        var p = pdf.get();
        return ResponseEntity.ok()
                .header("Content-Type", p.getContentType() != null ? p.getContentType() : "application/pdf")
                .header("Content-Disposition", "inline; filename=\"" + (p.getFileName() != null ? p.getFileName() : (courseId + ".pdf")) + "\"")
                .body(p.getData());
    }
}

