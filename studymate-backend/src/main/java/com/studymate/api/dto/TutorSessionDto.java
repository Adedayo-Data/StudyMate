package com.studymate.api.dto;

import java.util.List;

public class TutorSessionDto {
    public String id;
    public String userId;
    public String subject;
    public List<ChatMessageDto> messages;
    public String createdAt;
    public String updatedAt;
}
