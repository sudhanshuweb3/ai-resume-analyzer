package com.analyzer.controller;

import com.analyzer.domain.User;
import com.analyzer.dto.AnalysisResultDto;
import com.analyzer.dto.AnalyzeRequest;
import com.analyzer.dto.ApiResponse;
import com.analyzer.service.AnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    @PostMapping
    public ResponseEntity<ApiResponse<AnalysisResultDto>> analyze(
            @Valid @RequestBody AnalyzeRequest request,
            @AuthenticationPrincipal User user
    ) {
        AnalysisResultDto result = analysisService.analyze(request, user);
        return ResponseEntity.ok(ApiResponse.success(result, "Analysis completed successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AnalysisResultDto>>> getHistory(
            @AuthenticationPrincipal User user
    ) {
        List<AnalysisResultDto> history = analysisService.getUserHistory(user);
        return ResponseEntity.ok(ApiResponse.success(history, "Analysis history retrieved"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AnalysisResultDto>> getResult(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        AnalysisResultDto result = analysisService.getResult(id, user);
        return ResponseEntity.ok(ApiResponse.success(result, "Analysis result retrieved"));
    }
}
