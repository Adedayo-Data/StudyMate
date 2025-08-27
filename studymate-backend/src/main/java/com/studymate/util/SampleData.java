package com.studymate.util;

import com.studymate.api.dto.*;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class SampleData {
    public static final Map<String, CourseDto> courses = new ConcurrentHashMap<>();
    public static final Map<String, List<LessonDto>> lessonsByCourse = new ConcurrentHashMap<>();
    public static final Map<String, AssignmentDto> assignments = new ConcurrentHashMap<>();
    public static final Map<String, StudyPlanDto> studyPlans = new ConcurrentHashMap<>();
    public static final Map<String, DiscussionDto> discussions = new ConcurrentHashMap<>();
    public static final Map<String, TutorSessionDto> tutorSessions = new ConcurrentHashMap<>();

    static {
        seed();
    }

    private static void seed() {
        // Courses
        for (int i = 1; i <= 5; i++) {
            CourseDto c = new CourseDto();
            c.id = UUID.randomUUID().toString();
            c.title = "Course " + i;
            c.description = "Description for course " + i;
            c.instructor = "Instructor " + i;
            c.category = i % 2 == 0 ? "Science" : "Math";
            c.difficulty = i % 3 == 0 ? "ADVANCED" : (i % 2 == 0 ? "INTERMEDIATE" : "BEGINNER");
            c.duration = 10 + i;
            c.enrolledStudents = 100 * i;
            c.rating = 4.0 + (i % 5) * 0.1;
            c.thumbnail = null;
            c.createdAt = OffsetDateTime.now().minusDays(10 - i).toString();
            c.updatedAt = OffsetDateTime.now().toString();
            courses.put(c.id, c);

            List<LessonDto> ls = new ArrayList<>();
            for (int j = 1; j <= 6; j++) {
                LessonDto l = new LessonDto();
                l.id = UUID.randomUUID().toString();
                l.courseId = c.id;
                l.title = "Lesson " + j;
                l.description = "Lesson description " + j;
                l.content = "# Lesson " + j + " content";
                l.duration = 15 + j;
                l.order = j;
                l.videoUrl = null;
                l.isCompleted = false;
                ls.add(l);
            }
            lessonsByCourse.put(c.id, ls);
        }

        // Assignments
        for (CourseDto c : courses.values()) {
            AssignmentDto a = new AssignmentDto();
            a.id = UUID.randomUUID().toString();
            a.courseId = c.id;
            a.title = "Assignment for " + c.title;
            a.description = "Complete tasks for " + c.title;
            a.dueDate = OffsetDateTime.now().plusDays(7).toString();
            a.maxScore = 100;
            a.status = "PENDING";
            assignments.put(a.id, a);
        }

        // Study plan sample
        StudyPlanDto sp = new StudyPlanDto();
        sp.id = UUID.randomUUID().toString();
        sp.userId = "demo-user";
        sp.title = "My First Plan";
        sp.description = "Get through basics";
        sp.targetDate = OffsetDateTime.now().plusDays(30).toString();
        sp.courses = new ArrayList<>(courses.keySet()).subList(0, Math.min(3, courses.size()));
        sp.dailyStudyHours = 2;
        sp.progress = 10;
        sp.status = "ACTIVE";
        sp.createdAt = OffsetDateTime.now().toString();
        studyPlans.put(sp.id, sp);

        // Discussion sample
        DiscussionDto d = new DiscussionDto();
        d.id = UUID.randomUUID().toString();
        d.courseId = null;
        d.authorId = "demo-user";
        d.authorName = "student";
        d.title = "Welcome to StudyMate";
        d.content = "Let's learn together!";
        d.replies = new ArrayList<>();
        d.likes = 3;
        d.isLiked = false;
        d.createdAt = OffsetDateTime.now().toString();
        discussions.put(d.id, d);

        // AI Tutor sample session
        TutorSessionDto ts = new TutorSessionDto();
        ts.id = UUID.randomUUID().toString();
        ts.userId = "demo-user";
        ts.subject = "Mathematics";
        ts.messages = new ArrayList<>();
        ts.createdAt = OffsetDateTime.now().toString();
        ts.updatedAt = OffsetDateTime.now().toString();
        tutorSessions.put(ts.id, ts);
    }
}
