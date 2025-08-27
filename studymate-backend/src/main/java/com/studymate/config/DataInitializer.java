package com.studymate.config;

import com.studymate.api.dto.CourseDto;
import com.studymate.entity.CourseEntity;
import com.studymate.repository.CourseRepository;
import com.studymate.util.SampleData;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.UUID;

@Component
@Profile("postgres")
public class DataInitializer implements ApplicationRunner {

    private final CourseRepository courseRepository;

    public DataInitializer(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (courseRepository.count() > 0) return;
        // Seed courses from SampleData
        for (CourseDto c : SampleData.courses.values()) {
            CourseEntity e = new CourseEntity();
            e.setId(UUID.fromString(c.id));
            e.setTitle(c.title);
            e.setDescription(c.description);
            e.setInstructor(c.instructor);
            e.setCategory(c.category);
            e.setDifficulty(c.difficulty);
            e.setDuration(c.duration);
            e.setEnrolledStudents(c.enrolledStudents);
            e.setRating(c.rating);
            e.setThumbnail(c.thumbnail);
            e.setCreatedAt(c.createdAt != null ? OffsetDateTime.parse(c.createdAt) : OffsetDateTime.now());
            e.setUpdatedAt(c.updatedAt != null ? OffsetDateTime.parse(c.updatedAt) : e.getCreatedAt());
            courseRepository.save(e);
        }
    }
}
