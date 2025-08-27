package com.studymate.api.dto;

import java.util.List;

public class PageResponse<T> {
    public List<T> content;
    public long totalElements;

    public PageResponse() {}

    public PageResponse(List<T> content, long totalElements) {
        this.content = content;
        this.totalElements = totalElements;
    }
}
