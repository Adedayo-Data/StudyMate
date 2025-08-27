package com.studymate.controller;

import com.studymate.api.dto.StudyPlanDto;
import com.studymate.util.SampleData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/study-plans")
public class StudyPlanController {

    @GetMapping
    public ResponseEntity<List<StudyPlanDto>> list() {
        return ResponseEntity.ok(new ArrayList<>(SampleData.studyPlans.values()));
    }

    @PostMapping
    public ResponseEntity<StudyPlanDto> create(@RequestBody Map<String, Object> req) {
        StudyPlanDto sp = new StudyPlanDto();
        sp.id = UUID.randomUUID().toString();
        sp.userId = "demo-user";
        sp.title = String.valueOf(req.getOrDefault("title", "New Plan"));
        sp.description = (String) req.getOrDefault("description", "");
        Object coursesObj = req.get("courses");
        if (coursesObj instanceof List<?> l) {
            sp.courses = new ArrayList<>();
            for (Object o : l) sp.courses.add(String.valueOf(o));
        } else {
            sp.courses = new ArrayList<>();
        }
        sp.targetDate = String.valueOf(req.getOrDefault("targetDate", OffsetDateTime.now().plusDays(30).toString()));
        sp.dailyStudyHours = ((Number) req.getOrDefault("dailyStudyHours", 1)).intValue();
        sp.progress = 0;
        sp.status = "ACTIVE";
        sp.createdAt = OffsetDateTime.now().toString();
        SampleData.studyPlans.put(sp.id, sp);
        return ResponseEntity.ok(sp);
    }

    @PutMapping("/{planId}")
    public ResponseEntity<StudyPlanDto> update(@PathVariable String planId, @RequestBody Map<String, Object> updates) {
        StudyPlanDto sp = SampleData.studyPlans.get(planId);
        if (sp == null) return ResponseEntity.notFound().build();
        if (updates.containsKey("title")) sp.title = String.valueOf(updates.get("title"));
        if (updates.containsKey("description")) sp.description = String.valueOf(updates.get("description"));
        if (updates.containsKey("dailyStudyHours")) sp.dailyStudyHours = ((Number) updates.get("dailyStudyHours")).intValue();
        if (updates.containsKey("status")) sp.status = String.valueOf(updates.get("status"));
        if (updates.containsKey("courses")) {
            Object coursesObj = updates.get("courses");
            if (coursesObj instanceof List<?> l) {
                sp.courses = new ArrayList<>();
                for (Object o : l) sp.courses.add(String.valueOf(o));
            }
        }
        return ResponseEntity.ok(sp);
    }

    @DeleteMapping("/{planId}")
    public ResponseEntity<Void> delete(@PathVariable String planId) {
        SampleData.studyPlans.remove(planId);
        return ResponseEntity.ok().build();
    }
}
