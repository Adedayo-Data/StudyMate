package com.studymate.controller;

import com.studymate.api.dto.ChatMessageDto;
import com.studymate.api.dto.TutorSessionDto;
import com.studymate.service.GeminiService;
import com.studymate.util.SampleData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/ai-tutor")
public class AiTutorController {

    private final GeminiService geminiService;

    public AiTutorController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<TutorSessionDto>> listSessions() {
        return ResponseEntity.ok(new ArrayList<>(SampleData.tutorSessions.values()));
    }

    record CreateSessionRequest(String subject) {}

    @PostMapping("/sessions")
    public ResponseEntity<TutorSessionDto> createSession(@RequestBody CreateSessionRequest req) {
        TutorSessionDto ts = new TutorSessionDto();
        ts.id = UUID.randomUUID().toString();
        ts.userId = "demo-user";
        ts.subject = req.subject();
        ts.messages = new ArrayList<>();
        ts.createdAt = OffsetDateTime.now().toString();
        ts.updatedAt = OffsetDateTime.now().toString();
        SampleData.tutorSessions.put(ts.id, ts);
        return ResponseEntity.ok(ts);
    }

    record SendMessageRequest(String content) {}

    @PostMapping("/sessions/{id}/messages")
    public ResponseEntity<ChatMessageDto> sendMessage(@PathVariable("id") String sessionId,
                                                      @RequestBody SendMessageRequest req) {
        TutorSessionDto ts = SampleData.tutorSessions.get(sessionId);
        if (ts == null) return ResponseEntity.notFound().build();

        // Save user message
        ChatMessageDto userMsg = new ChatMessageDto();
        userMsg.id = UUID.randomUUID().toString();
        userMsg.role = "user";
        userMsg.content = req.content();
        userMsg.timestamp = OffsetDateTime.now().toString();
        ts.messages.add(userMsg);

        // Generate assistant reply via Gemini
        ChatMessageDto aiMsg = new ChatMessageDto();
        aiMsg.id = UUID.randomUUID().toString();
        aiMsg.role = "assistant";
        String aiText = geminiService.generateText(req.content());
        aiMsg.content = aiText;
        aiMsg.timestamp = OffsetDateTime.now().toString();
        ts.messages.add(aiMsg);

        ts.updatedAt = OffsetDateTime.now().toString();
        SampleData.tutorSessions.put(ts.id, ts);

        return ResponseEntity.ok(aiMsg);
    }
}
