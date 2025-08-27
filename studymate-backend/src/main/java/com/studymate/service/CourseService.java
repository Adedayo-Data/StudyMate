package com.studymate.service;

import com.studymate.api.dto.CourseDto;
import com.studymate.entity.CourseEntity;
import com.studymate.entity.CoursePdfEntity;
import com.studymate.repository.CoursePdfRepository;
import com.studymate.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final CoursePdfRepository pdfRepository;

    public CourseService(CourseRepository courseRepository, CoursePdfRepository pdfRepository) {
        this.courseRepository = courseRepository;
        this.pdfRepository = pdfRepository;
    }

    public List<CourseDto> list(int page, int size, String category) {
        // simple impl for now: fetch all and slice in-memory
        var all = courseRepository.findAll();
        if (category != null && !category.isBlank()) {
            all = all.stream().filter(c -> category.equalsIgnoreCase(c.getCategory())).collect(Collectors.toList());
        }
        return all.stream().map(this::toDto).collect(Collectors.toList());
    }

    public long count(String category) {
        if (category == null || category.isBlank()) return courseRepository.count();
        return courseRepository.findAll().stream().filter(c -> category.equalsIgnoreCase(c.getCategory())).count();
    }

    public Optional<CourseDto> get(String id) {
        try {
            var uuid = UUID.fromString(id);
            return courseRepository.findById(uuid).map(this::toDto);
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    @Transactional
    public void uploadPdf(String courseId, MultipartFile file) throws IOException {
        var uuid = UUID.fromString(courseId);
        var course = courseRepository.findById(uuid).orElseThrow();
        var entity = new CoursePdfEntity();
        entity.setCourseId(uuid);
        entity.setFileName(file.getOriginalFilename());
        entity.setContentType(file.getContentType() != null ? file.getContentType() : "application/pdf");
        entity.setData(file.getBytes());
        pdfRepository.save(entity);
        // touch update time
        course.setUpdatedAt(OffsetDateTime.now());
        courseRepository.save(course);
    }

    public Optional<CoursePdfEntity> getPdf(String courseId) {
        try {
            var uuid = UUID.fromString(courseId);
            return pdfRepository.findById(uuid);
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    private CourseDto toDto(CourseEntity c) {
        var d = new CourseDto();
        d.id = c.getId().toString();
        d.title = c.getTitle();
        d.description = c.getDescription();
        d.instructor = c.getInstructor();
        d.category = c.getCategory();
        d.difficulty = c.getDifficulty();
        d.duration = c.getDuration() != null ? c.getDuration() : 0;
        d.enrolledStudents = c.getEnrolledStudents() != null ? c.getEnrolledStudents() : 0;
        d.rating = c.getRating() != null ? c.getRating() : 0.0;
        d.thumbnail = c.getThumbnail();
        d.createdAt = c.getCreatedAt() != null ? c.getCreatedAt().toString() : null;
        d.updatedAt = c.getUpdatedAt() != null ? c.getUpdatedAt().toString() : null;
        return d;
    }
}
