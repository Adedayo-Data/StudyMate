package com.studymate.controller;

import com.studymate.api.dto.AssignmentDto;
import com.studymate.util.SampleData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    @GetMapping
    public ResponseEntity<List<AssignmentDto>> list(@RequestParam(required = false) String courseId) {
        List<AssignmentDto> list = SampleData.assignments.values().stream()
                .filter(a -> courseId == null || courseId.equals(a.courseId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{assignmentId}")
    public ResponseEntity<AssignmentDto> get(@PathVariable String assignmentId) {
        AssignmentDto a = SampleData.assignments.get(assignmentId);
        if (a == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(a);
    }

    @PostMapping("/{assignmentId}/submit")
    public ResponseEntity<Void> submit(@PathVariable String assignmentId, @RequestBody Map<String, Object> body) {
        AssignmentDto a = SampleData.assignments.get(assignmentId);
        if (a != null) {
            a.status = "SUBMITTED";
            a.submittedAt = OffsetDateTime.now().toString();
        }
        return ResponseEntity.ok().build();
    }
}
