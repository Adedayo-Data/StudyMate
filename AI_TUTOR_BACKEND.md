# AI Tutor Backend Implementation (Spring Boot + Gemini)

This document specifies how to implement the AI Tutor feature for the StudyMate backend using Java Spring Boot and the Gemini API. It aligns with the frontend API client in `smart-study/src/lib/api.ts` (`tutorApi`).

Backend base URL expected by frontend: `http://localhost:8080/api`

## Endpoints to Implement

- GET `/api/ai-tutor/sessions`
  - Returns a list of tutor sessions for the authenticated user, including recent messages.
- POST `/api/ai-tutor/sessions`
  - Body: `{ "subject": string }`
  - Creates a new tutor session for the user and returns it.
- POST `/api/ai-tutor/sessions/{sessionId}/messages`
  - Body: `{ "content": string }`
  - Sends user message to Gemini with session history, stores both user message and AI reply, and returns the AI reply as a `ChatMessage`.

These match the frontend `tutorApi` usage.

## Data Model

```java
// src/main/java/com/studymate/ai/ChatMessage.java
package com.studymate.ai;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "ai_chat_messages")
public class ChatMessage {
  @Id
  private String id = UUID.randomUUID().toString();

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "session_id")
  private TutorSession session;

  @Column(nullable = false)
  private String role; // "user" | "assistant"

  @Column(nullable = false, length = 8000)
  private String content;

  @Column(nullable = false)
  private OffsetDateTime timestamp = OffsetDateTime.now();

  // getters/setters
}
```

```java
// src/main/java/com/studymate/ai/TutorSession.java
package com.studymate.ai;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.*;

@Entity
@Table(name = "ai_tutor_sessions")
public class TutorSession {
  @Id
  private String id = UUID.randomUUID().toString();

  @Column(nullable = false)
  private String userId; // from your auth principal/JWT

  @Column(nullable = false)
  private String subject;

  @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("timestamp ASC")
  private List<ChatMessage> messages = new ArrayList<>();

  @Column(nullable = false)
  private OffsetDateTime createdAt = OffsetDateTime.now();

  @Column(nullable = false)
  private OffsetDateTime updatedAt = OffsetDateTime.now();

  // getters/setters
}
```

Repositories:

```java
// src/main/java/com/studymate/ai/TutorSessionRepository.java
package com.studymate.ai;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TutorSessionRepository extends JpaRepository<TutorSession, String> {
  List<TutorSession> findByUserIdOrderByUpdatedAtDesc(String userId);
}
```

```java
// src/main/java/com/studymate/ai/ChatMessageRepository.java
package com.studymate.ai;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {}
```

## DTOs (match frontend types)

```java
// src/main/java/com/studymate/ai/dto/ChatMessageDto.java
package com.studymate.ai.dto;

import java.time.OffsetDateTime;

public record ChatMessageDto(
  String id,
  String role, // user | assistant
  String content,
  String timestamp // ISO string
) {}
```

```java
// src/main/java/com/studymate/ai/dto/TutorSessionDto.java
package com.studymate.ai.dto;

import java.util.List;

public record TutorSessionDto(
  String id,
  String userId,
  String subject,
  List<ChatMessageDto> messages,
  String createdAt,
  String updatedAt
) {}
```

```java
// src/main/java/com/studymate/ai/dto/CreateSessionRequest.java
package com.studymate.ai.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateSessionRequest(@NotBlank String subject) {}
```

```java
// src/main/java/com/studymate/ai/dto/SendMessageRequest.java
package com.studymate.ai.dto;

import jakarta.validation.constraints.NotBlank;

public record SendMessageRequest(@NotBlank String content) {}
```

## Gemini Client via REST (WebClient)

We will call Gemini using REST to avoid strict dependency on evolving SDKs. Endpoint example:
`POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=YOUR_API_KEY`

```java
// src/main/java/com/studymate/ai/GeminiClient.java
package com.studymate.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.*;

@Component
public class GeminiClient {
  private final WebClient webClient;
  private final String model;
  private final String apiKey;

  public GeminiClient(
      @Value("${gemini.apiBase:https://generativelanguage.googleapis.com}") String apiBase,
      @Value("${gemini.model:models/gemini-1.5-pro}") String model,
      @Value("${gemini.apiKey}") String apiKey) {
    this.webClient = WebClient.builder().baseUrl(apiBase).build();
    this.model = model;
    this.apiKey = apiKey;
  }

  public Mono<String> generate(List<Map<String, Object>> history, String userPrompt) {
    // Build contents combining history and user input per Gemini JSON schema
    List<Map<String, Object>> contents = new ArrayList<>();
    for (var h : history) contents.add(h);
    contents.add(Map.of(
      "role", "user",
      "parts", List.of(Map.of("text", userPrompt))
    ));

    Map<String, Object> body = Map.of(
      "contents", contents
    );

    String path = String.format("/v1beta/%s:generateContent?key=%s", model, apiKey);

    return webClient.post()
      .uri(path)
      .contentType(MediaType.APPLICATION_JSON)
      .bodyValue(body)
      .retrieve()
      .bodyToMono(Map.class)
      .map(resp -> {
        // Extract first candidate text
        // Response shape: { candidates: [ { content: { parts: [ { text: "..." } ] } } ] }
        var candidates = (List<Map<String, Object>>) resp.getOrDefault("candidates", List.of());
        if (candidates.isEmpty()) return "I'm sorry, I don't have a response right now.";
        var content = (Map<String, Object>) candidates.get(0).get("content");
        var parts = (List<Map<String, Object>>) content.getOrDefault("parts", List.of());
        if (parts.isEmpty()) return "I'm sorry, I don't have a response right now.";
        return String.valueOf(parts.get(0).getOrDefault("text", ""));
      });
  }

  public static Map<String, Object> toGeminiMessage(String role, String text) {
    return Map.of(
      "role", role.equals("assistant") ? "model" : "user",
      "parts", List.of(Map.of("text", text))
    );
  }
}
```

Environment variables/application.yml:

```yaml
# src/main/resources/application.yml
gemini:
  apiKey: ${GEMINI_API_KEY}
  model: models/gemini-1.5-pro
  apiBase: https://generativelanguage.googleapis.com
```

Export `GEMINI_API_KEY` in your environment.

## Service Layer

```java
// src/main/java/com/studymate/ai/TutorService.java
package com.studymate.ai;

import com.studymate.ai.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class TutorService {
  private final TutorSessionRepository sessions;
  private final ChatMessageRepository messages;
  private final GeminiClient gemini;

  public TutorService(TutorSessionRepository sessions, ChatMessageRepository messages, GeminiClient gemini) {
    this.sessions = sessions;
    this.messages = messages;
    this.gemini = gemini;
  }

  public List<TutorSessionDto> listSessions(String userId) {
    return sessions.findByUserIdOrderByUpdatedAtDesc(userId).stream().map(this::toDto).toList();
  }

  @Transactional
  public TutorSessionDto createSession(String userId, String subject) {
    var s = new TutorSession();
    s.setUserId(userId);
    s.setSubject(subject);
    var saved = sessions.save(s);
    return toDto(saved);
  }

  @Transactional
  public Mono<ChatMessageDto> sendMessage(String userId, String sessionId, String content) {
    var s = sessions.findById(sessionId).orElseThrow(() -> new NoSuchElementException("Session not found"));
    if (!Objects.equals(s.getUserId(), userId)) throw new SecurityException("Forbidden");

    // Save user message
    var userMsg = new ChatMessage();
    userMsg.setSession(s);
    userMsg.setRole("user");
    userMsg.setContent(content);
    userMsg.setTimestamp(OffsetDateTime.now());
    messages.save(userMsg);

    // Build history for Gemini
    List<Map<String, Object>> history = s.getMessages().stream()
      .map(m -> GeminiClient.toGeminiMessage(m.getRole().equals("assistant") ? "model" : "user", m.getContent()))
      .toList();

    return gemini.generate(history, content)
      .map(replyText -> {
        // Save assistant reply
        var aiMsg = new ChatMessage();
        aiMsg.setSession(s);
        aiMsg.setRole("assistant");
        aiMsg.setContent(replyText);
        aiMsg.setTimestamp(OffsetDateTime.now());
        messages.save(aiMsg);

        s.getMessages().add(userMsg);
        s.getMessages().add(aiMsg);
        s.setUpdatedAt(OffsetDateTime.now());
        sessions.save(s);

        return new ChatMessageDto(
          aiMsg.getId(),
          aiMsg.getRole(),
          aiMsg.getContent(),
          aiMsg.getTimestamp().toString()
        );
      });
  }

  // Mapping
  private TutorSessionDto toDto(TutorSession s) {
    var msgs = s.getMessages().stream()
      .map(m -> new ChatMessageDto(m.getId(), m.getRole(), m.getContent(), m.getTimestamp().toString()))
      .toList();
    return new TutorSessionDto(
      s.getId(), s.getUserId(), s.getSubject(), msgs, s.getCreatedAt().toString(), s.getUpdatedAt().toString());
  }
}
```

## Controller

```java
// src/main/java/com/studymate/ai/TutorController.java
package com.studymate.ai;

import com.studymate.ai.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/ai-tutor")
public class TutorController {
  private final TutorService service;

  public TutorController(TutorService service) { this.service = service; }

  @GetMapping("/sessions")
  public List<TutorSessionDto> list(Principal principal) {
    String userId = principal.getName(); // adapt based on your security
    return service.listSessions(userId);
  }

  @PostMapping("/sessions")
  public TutorSessionDto create(@Valid @RequestBody CreateSessionRequest req, Principal principal) {
    String userId = principal.getName();
    return service.createSession(userId, req.subject());
  }

  @PostMapping(value = "/sessions/{id}/messages", produces = MediaType.APPLICATION_JSON_VALUE)
  public Mono<ChatMessageDto> send(@PathVariable("id") String sessionId,
                                   @Valid @RequestBody SendMessageRequest req,
                                   Principal principal) {
    String userId = principal.getName();
    return service.sendMessage(userId, sessionId, req.content());
  }
}
```

## Maven Dependencies

Add to your backend `pom.xml`:

```xml
<dependencies>
  <!-- Spring Web & Validation -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
  </dependency>

  <!-- Reactive WebClient for Gemini REST calls -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
  </dependency>

  <!-- Persistence (if storing sessions/messages) -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
  </dependency>
  <dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
  </dependency>

  <!-- Lombok (optional for getters/setters) -->
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
  </dependency>
</dependencies>
```

If you prefer using the official Gemini Java SDK when stable for you, replace the `GeminiClient` with that SDK and keep the controller/service interfaces the same.

## CORS

Allow frontend origin (e.g., http://localhost:3000):

```java
// src/main/java/com/studymate/config/CorsConfig.java
package com.studymate.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
  @Bean
  public CorsFilter corsFilter() {
    CorsConfiguration config = new CorsConfiguration();
    config.addAllowedOriginPattern("http://localhost:3000");
    config.addAllowedHeader("*");
    config.addAllowedMethod("*");
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", config);
    return new CorsFilter(source);
  }
}
```

## Security Notes

- Use your existing JWT security to set `Principal` (or extract user id from a custom `Authentication`).
- Rate-limit requests to `/api/ai-tutor/sessions/{id}/messages` to avoid abuse.
- Store only needed message text; consider truncating long histories before sending to Gemini (token limits).

## History Formatting for Gemini

Gemini expects role values `user` and `model` in `contents`. We map:
- our `user` → `user`
- our `assistant` → `model`

Each content is a part with `text` field.

## Frontend Compatibility

This implementation returns DTOs compatible with the frontend in `smart-study/src/lib/api.ts`:
- `TutorSession` fields: `id`, `userId`, `subject`, `messages`, `createdAt`, `updatedAt`
- `ChatMessage` fields: `id`, `role` (user|assistant), `content`, `timestamp`

The `POST /messages` endpoint returns the assistant `ChatMessage` so the UI can append it immediately.

## Optional Enhancements

- Streaming responses via SSE for token-by-token UX.
- Conversation memory cap and summarization to keep prompts short.
- Subjects as a system instruction prefix (e.g., "You are a helpful tutor specialized in {subject}").
- Caching previous Gemini replies for repeated prompts.
