package com.studymate.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {
    private final WebClient webClient;
    private final String apiKey;
    private final String modelName;

    public GeminiService(
            @Value("${gemini.apiKey:${GEMINI_API_KEY:}}") String apiKey,
            @Value("${gemini.model:gemini-1.5-flash}") String modelName
    ) {
        this.apiKey = apiKey;
        this.modelName = modelName;
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    public String generateText(String userMessage) {
        if (apiKey == null || apiKey.isBlank()) {
            return "[AI is not configured] Please set GEMINI_API_KEY to enable AI responses.";
        }
        try {
            var path = String.format("/v1beta/models/%s:generateContent?key=%s", modelName, apiKey);
            var body = Map.of(
                    "contents", List.of(
                            Map.of(
                                    "parts", List.of(
                                            Map.of("text", userMessage)
                                    )
                            )
                    )
            );
            var response = webClient.post()
                    .uri(path)
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .onErrorResume(ex -> Mono.just(Map.of("error", ex.getMessage())))
                    .block();

            // Parse minimal text from candidates[0].content.parts[0].text
            if (response == null) return "[AI error] Empty response from Gemini.";
            if (response.containsKey("error")) return "[AI error] " + response.get("error");
            var candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates == null || candidates.isEmpty()) return "[AI] No candidates returned.";
            var content = (Map<String, Object>) candidates.get(0).get("content");
            if (content == null) return "[AI] No content returned.";
            var parts = (List<Map<String, Object>>) content.get("parts");
            if (parts == null || parts.isEmpty()) return "[AI] No parts returned.";
            var text = (String) parts.get(0).get("text");
            return (text != null && !text.isBlank()) ? text : "[AI] Empty text returned.";
        } catch (Exception e) {
            return "[AI exception] " + e.getMessage();
        }
    }
}
