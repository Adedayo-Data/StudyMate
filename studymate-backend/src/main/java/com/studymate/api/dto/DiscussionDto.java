package com.studymate.api.dto;

import java.util.List;

public class DiscussionDto {
    public String id;
    public String courseId;
    public String authorId;
    public String authorName;
    public String title;
    public String content;
    public List<ReplyDto> replies;
    public int likes;
    public Boolean isLiked;
    public String createdAt;
}
