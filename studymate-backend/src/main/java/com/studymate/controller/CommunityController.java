package com.studymate.controller;

import com.studymate.api.dto.DiscussionDto;
import com.studymate.api.dto.PageResponse;
import com.studymate.api.dto.ReplyDto;
import com.studymate.entity.UserEntity;
import com.studymate.repository.UserRepository;
import com.studymate.util.SampleData;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/discussions")
public class CommunityController {

    private final UserRepository userRepository;

    public CommunityController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<PageResponse<DiscussionDto>> list(
            @RequestParam(required = false) String courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        List<DiscussionDto> all = new ArrayList<>(SampleData.discussions.values());
        if (courseId != null && !courseId.isBlank()) {
            all = all.stream()
                    .filter(d -> courseId.equals(d.courseId))
                    .collect(Collectors.toList());
        }
        long total = all.size();
        int from = Math.min(page * size, all.size());
        int to = Math.min(from + size, all.size());
        List<DiscussionDto> slice = all.subList(from, to);
        return ResponseEntity.ok(new PageResponse<>(slice, total));
    }

    record CreateDiscussion(String courseId, String title, String content) {}

    @PostMapping
    public ResponseEntity<DiscussionDto> create(@RequestBody CreateDiscussion req) {
        DiscussionDto d = new DiscussionDto();
        d.id = UUID.randomUUID().toString();
        d.courseId = req.courseId();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            Optional<UserEntity> userOpt = userRepository.findByEmail(auth.getName());
            if (userOpt.isPresent()) {
                UserEntity user = userOpt.get();
                d.authorId = user.getId().toString();
                d.authorName = user.getUsername();
            } else {
                d.authorId = "demo-user";
                d.authorName = "Anonymous";
            }
        } else {
            d.authorId = "demo-user";
            d.authorName = "Anonymous";
        }
        d.title = req.title();
        d.content = req.content();
        d.replies = new ArrayList<>();
        d.likes = 0;
        d.isLiked = false;
        d.createdAt = OffsetDateTime.now().toString();
        SampleData.discussions.put(d.id, d);
        return ResponseEntity.ok(d);
    }

    record ReplyRequest(String content) {}

    @PostMapping("/{discussionId}/replies")
    public ResponseEntity<ReplyDto> reply(@PathVariable String discussionId, @RequestBody ReplyRequest req) {
        DiscussionDto d = SampleData.discussions.get(discussionId);
        if (d == null) return ResponseEntity.notFound().build();
        ReplyDto r = new ReplyDto();
        r.id = UUID.randomUUID().toString();
        r.discussionId = discussionId;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            Optional<UserEntity> userOpt = userRepository.findByEmail(auth.getName());
            if (userOpt.isPresent()) {
                UserEntity user = userOpt.get();
                r.authorId = user.getId().toString();
                r.authorName = user.getUsername();
            } else {
                r.authorId = "demo-user";
                r.authorName = "Anonymous";
            }
        } else {
            r.authorId = "demo-user";
            r.authorName = "Anonymous";
        }
        r.content = req.content();
        r.likes = 0;
        r.isLiked = false;
        r.createdAt = OffsetDateTime.now().toString();
        d.replies.add(r);
        return ResponseEntity.ok(r);
    }

    @PostMapping("/{discussionId}/like")
    public ResponseEntity<Void> like(@PathVariable String discussionId) {
        DiscussionDto d = SampleData.discussions.get(discussionId);
        if (d != null) {
            d.likes = d.likes + 1;
            d.isLiked = true;
        }
        return ResponseEntity.ok().build();
    }
}
