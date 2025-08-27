-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor VARCHAR(255),
    category VARCHAR(100),
    difficulty VARCHAR(50),
    duration INT,
    enrolled_students INT,
    rating DOUBLE PRECISION,
    thumbnail VARCHAR(1000),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- Course PDFs table
CREATE TABLE IF NOT EXISTS course_pdfs (
    course_id UUID PRIMARY KEY REFERENCES courses(id) ON DELETE CASCADE,
    file_name VARCHAR(512),
    content_type VARCHAR(255),
    data BYTEA NOT NULL
);
