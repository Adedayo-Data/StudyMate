package com.studymate.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "course_pdfs")
public class CoursePdfEntity {
    @Id
    @Column(name = "course_id", nullable = false)
    private UUID courseId;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "content_type")
    private String contentType;

    @Lob
    @Column(name = "data", nullable = false)
    private byte[] data;

    public UUID getCourseId() { return courseId; }
    public void setCourseId(UUID courseId) { this.courseId = courseId; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public byte[] getData() { return data; }
    public void setData(byte[] data) { this.data = data; }
}
