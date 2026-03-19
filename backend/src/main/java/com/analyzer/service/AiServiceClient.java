package com.analyzer.service;

import com.analyzer.dto.AiAnalysisRequest;
import com.analyzer.dto.AiAnalysisResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiServiceClient {

    private final RestTemplate restTemplate;

    @Value("${application.ai-service.base-url}")
    private String aiServiceBaseUrl;

    public AiAnalysisResponse analyzeCompatibility(String resumeText, String jobDescriptionText) {
        String url = aiServiceBaseUrl + "/api/v1/nlp/analyze";

        AiAnalysisRequest request = AiAnalysisRequest.builder()
                .resumeText(resumeText)
                .jobDescriptionText(jobDescriptionText)
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<AiAnalysisRequest> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<AiAnalysisResponse> response = restTemplate.postForEntity(
                    url, entity, AiAnalysisResponse.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to call AI service at {}: {}", url, e.getMessage());
            throw new RuntimeException("AI service is unavailable. Please try again later.");
        }
    }
}
