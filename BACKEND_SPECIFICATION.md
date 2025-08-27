# MyCogniAI Backend Architecture Specification

## Overview
This document outlines the complete backend architecture for MyCogniAI, an AI-powered learning platform built with Java Spring Boot. The backend serves a Next.js frontend and provides comprehensive APIs for user management, course delivery, progress tracking, AI tutoring, and community features.

## Technology Stack

### Core Framework
- **Java 17+** - Programming language
- **Spring Boot 3.x** - Main framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database operations
- **Spring Web** - REST API development
- **Spring Validation** - Input validation

### Database
- **PostgreSQL** - Primary database
- **Redis** - Caching and session storage
- **H2** - Testing database

### Additional Dependencies
- **JWT (jsonwebtoken)** - Token-based authentication
- **MapStruct** - Entity-DTO mapping
- **OpenAPI 3 (Springdoc)** - API documentation
- **Lombok** - Boilerplate code reduction
- **Jackson** - JSON processing
- **Apache Commons** - Utility functions

### AI Integration
- **OpenAI API** - AI tutoring capabilities
- **Spring AI** - AI integration framework

### Testing
- **JUnit 5** - Unit testing
- **Testcontainers** - Integration testing
- **MockMvc** - API testing

## Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/studymate/
│   │       ├── StudyMateApplication.java
│   │       ├── config/
│   │       │   ├── SecurityConfig.java
│   │       │   ├── JwtConfig.java
│   │       │   ├── RedisConfig.java
│   │       │   └── OpenApiConfig.java
│   │       ├── controller/
│   │       │   ├── AuthController.java
│   │       │   ├── UserController.java
│   │       │   ├── CourseController.java
│   │       │   ├── AssignmentController.java
│   │       │   ├── StudyPlanController.java
│   │       │   ├── ProgressController.java
│   │       │   ├── CommunityController.java
│   │       │   └── AiTutorController.java
│   │       ├── service/
│   │       │   ├── AuthService.java
│   │       │   ├── UserService.java
│   │       │   ├── CourseService.java
│   │       │   ├── AssignmentService.java
│   │       │   ├── StudyPlanService.java
│   │       │   ├── ProgressService.java
│   │       │   ├── CommunityService.java
│   │       │   └── AiTutorService.java
│   │       ├── repository/
│   │       │   ├── UserRepository.java
│   │       │   ├── CourseRepository.java
│   │       │   ├── LessonRepository.java
│   │       │   ├── AssignmentRepository.java
│   │       │   ├── StudyPlanRepository.java
│   │       │   ├── UserProgressRepository.java
│   │       │   ├── DiscussionRepository.java
│   │       │   └── TutorSessionRepository.java
│   │       ├── entity/
│   │       │   ├── User.java
│   │       │   ├── Course.java
│   │       │   ├── Lesson.java
│   │       │   ├── Assignment.java
│   │       │   ├── StudyPlan.java
│   │       │   ├── UserProgress.java
│   │       │   ├── Discussion.java
│   │       │   ├── Reply.java
│   │       │   └── TutorSession.java
│   │       ├── dto/
│   │       │   ├── request/
│   │       │   └── response/
│   │       ├── mapper/
│   │       ├── exception/
│   │       │   ├── GlobalExceptionHandler.java
│   │       │   ├── CustomExceptions.java
│   │       │   └── ErrorResponse.java
│   │       └── util/
│   │           ├── JwtUtil.java
│   │           └── ValidationUtil.java
│   └── resources/
│       ├── application.yml
│       ├── application-dev.yml
│       ├── application-prod.yml
│       └── db/migration/
└── test/
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(500),
    role VARCHAR(20) DEFAULT 'STUDENT',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

### Courses Table
```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructor VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    duration_hours INTEGER NOT NULL,
    enrolled_students INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    thumbnail VARCHAR(500),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Lessons Table
```sql
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    video_url VARCHAR(500),
    duration_minutes INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Course Enrollments Table
```sql
CREATE TABLE user_course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    UNIQUE(user_id, course_id)
);
```

### User Lesson Progress Table
```sql
CREATE TABLE user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMP,
    time_spent_minutes INTEGER DEFAULT 0,
    UNIQUE(user_id, lesson_id)
);
```

### Assignments Table
```sql
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    due_date TIMESTAMP NOT NULL,
    max_score INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Assignment Submissions Table
```sql
CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score INTEGER,
    feedback TEXT,
    graded_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'GRADED')),
    UNIQUE(assignment_id, user_id)
);
```

### Study Plans Table
```sql
CREATE TABLE study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    target_date DATE NOT NULL,
    daily_study_hours INTEGER NOT NULL,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'PAUSED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Study Plan Courses Table
```sql
CREATE TABLE study_plan_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_plan_id UUID NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    UNIQUE(study_plan_id, course_id)
);
```

### User Progress Table
```sql
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_courses_enrolled INTEGER DEFAULT 0,
    completed_courses INTEGER DEFAULT 0,
    total_lessons_completed INTEGER DEFAULT 0,
    total_study_hours INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.00,
    last_activity_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);
```

### Discussions Table
```sql
CREATE TABLE discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Discussion Replies Table
```sql
CREATE TABLE discussion_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Discussion Likes Table
```sql
CREATE TABLE discussion_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
    reply_id UUID REFERENCES discussion_replies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_discussion_or_reply CHECK (
        (discussion_id IS NOT NULL AND reply_id IS NULL) OR
        (discussion_id IS NULL AND reply_id IS NOT NULL)
    )
);
```

### AI Tutor Sessions Table
```sql
CREATE TABLE tutor_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Chat Messages Table
```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES tutor_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## REST API Endpoints

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### User Management Endpoints
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `POST /api/users/me/avatar` - Upload profile picture
- `DELETE /api/users/me` - Delete user account

### Course Endpoints
- `GET /api/courses` - Get courses (with pagination, filtering)
- `GET /api/courses/{courseId}` - Get course details
- `POST /api/courses/{courseId}/enroll` - Enroll in course
- `DELETE /api/courses/{courseId}/enroll` - Unenroll from course
- `GET /api/courses/{courseId}/lessons` - Get course lessons
- `GET /api/courses/{courseId}/lessons/{lessonId}` - Get lesson details
- `POST /api/courses/{courseId}/lessons/{lessonId}/complete` - Mark lesson complete

### Assignment Endpoints
- `GET /api/assignments` - Get assignments (optionally filtered by course)
- `GET /api/assignments/{assignmentId}` - Get assignment details
- `POST /api/assignments/{assignmentId}/submit` - Submit assignment
- `GET /api/assignments/{assignmentId}/submission` - Get user's submission

### Study Plan Endpoints
- `GET /api/study-plans` - Get user's study plans
- `POST /api/study-plans` - Create study plan
- `GET /api/study-plans/{planId}` - Get study plan details
- `PUT /api/study-plans/{planId}` - Update study plan
- `DELETE /api/study-plans/{planId}` - Delete study plan

### Progress Tracking Endpoints
- `GET /api/progress/me` - Get user progress summary
- `GET /api/progress/dashboard-stats` - Get dashboard statistics
- `GET /api/progress/courses/{courseId}` - Get course progress
- `POST /api/progress/study-session` - Log study session

### Community Endpoints
- `GET /api/discussions` - Get discussions (with pagination, filtering)
- `POST /api/discussions` - Create discussion
- `GET /api/discussions/{discussionId}` - Get discussion details
- `POST /api/discussions/{discussionId}/replies` - Reply to discussion
- `POST /api/discussions/{discussionId}/like` - Like/unlike discussion
- `POST /api/discussions/{discussionId}/replies/{replyId}/like` - Like/unlike reply

### AI Tutor Endpoints
- `GET /api/ai-tutor/sessions` - Get user's tutor sessions
- `POST /api/ai-tutor/sessions` - Create new tutor session
- `GET /api/ai-tutor/sessions/{sessionId}` - Get session details
- `POST /api/ai-tutor/sessions/{sessionId}/messages` - Send message to AI tutor
- `DELETE /api/ai-tutor/sessions/{sessionId}` - Delete tutor session

## Security Configuration

### JWT Authentication
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Tokens include user ID, username, and roles
- Secure token storage with HttpOnly cookies option

### Password Security
- BCrypt hashing with salt rounds of 12
- Password complexity requirements
- Account lockout after 5 failed attempts

### API Security
- CORS configuration for frontend domain
- Rate limiting on authentication endpoints
- Input validation and sanitization
- SQL injection prevention with parameterized queries

## Caching Strategy

### Redis Caching
- User sessions and JWT tokens
- Frequently accessed course data
- Dashboard statistics
- AI tutor conversation history (temporary)

### Cache Keys
- `user:session:{userId}` - User session data
- `course:details:{courseId}` - Course information
- `user:progress:{userId}` - User progress data
- `dashboard:stats:{userId}` - Dashboard statistics

## Error Handling

### Global Exception Handler
- Validation errors (400 Bad Request)
- Authentication errors (401 Unauthorized)
- Authorization errors (403 Forbidden)
- Resource not found (404 Not Found)
- Internal server errors (500 Internal Server Error)

### Error Response Format
```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/users/me",
  "details": [
    {
      "field": "email",
      "message": "Email format is invalid"
    }
  ]
}
```

## Configuration Files

### application.yml
```yaml
server:
  port: 8080
  servlet:
    context-path: /

spring:
  application:
    name: studymate-backend
  
  datasource:
    url: jdbc:postgresql://localhost:5432/studymate
    username: ${DB_USERNAME:studymate}
    password: ${DB_PASSWORD:password}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  
  redis:
    host: localhost
    port: 6379
    password: ${REDIS_PASSWORD:}
    timeout: 2000ms
  
  security:
    jwt:
      secret: ${JWT_SECRET:your-secret-key}
      expiration: 900000 # 15 minutes
      refresh-expiration: 604800000 # 7 days

openai:
  api:
    key: ${OPENAI_API_KEY}
    model: gpt-3.5-turbo

logging:
  level:
    com.studymate: INFO
    org.springframework.security: DEBUG
```

## Deployment Considerations

### Environment Variables
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `REDIS_PASSWORD` - Redis password
- `JWT_SECRET` - JWT signing secret
- `OPENAI_API_KEY` - OpenAI API key

### Docker Configuration
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/studymate-backend.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Health Checks
- `/actuator/health` - Application health
- `/actuator/info` - Application information
- Database connectivity check
- Redis connectivity check

## Testing Strategy

### Unit Tests
- Service layer business logic
- Repository layer data access
- Utility functions
- JWT token handling

### Integration Tests
- Controller endpoints
- Database operations
- Security configurations
- External API integrations

### Test Data
- Test fixtures for entities
- Mock data for AI responses
- Sample course content

## Performance Optimization

### Database Optimization
- Proper indexing on frequently queried columns
- Connection pooling configuration
- Query optimization with JPA criteria
- Pagination for large datasets

### Caching Strategy
- Application-level caching with Spring Cache
- Database query result caching
- Static content caching

### Monitoring
- Application metrics with Micrometer
- Database performance monitoring
- API response time tracking
- Error rate monitoring

This specification provides a comprehensive foundation for implementing the StudyMate backend with Java Spring Boot, ensuring scalability, security, and maintainability.
