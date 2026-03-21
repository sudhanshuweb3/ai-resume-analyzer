package com.analyzer.controller;

import com.analyzer.domain.User;
import com.analyzer.dto.ApiResponse;
import com.analyzer.dto.JobDescriptionDto;
import com.analyzer.dto.JobDescriptionRequest;
import com.analyzer.service.JobDescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobDescriptionController {

    private final JobDescriptionService jobDescriptionService;

    @PostMapping
    public ResponseEntity<ApiResponse<JobDescriptionDto>> createJobDescription(
            @Valid @RequestBody JobDescriptionRequest request,
            @AuthenticationPrincipal User user
    ) {
        JobDescriptionDto dto = jobDescriptionService.save(request, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Job description saved successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobDescriptionDto>>> getUserJobDescriptions(
            @AuthenticationPrincipal User user
    ) {
        List<JobDescriptionDto> list = jobDescriptionService.getUserJobDescriptions(user);
        return ResponseEntity.ok(ApiResponse.success(list, "Job descriptions retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobDescriptionDto>> getById(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        JobDescriptionDto dto = jobDescriptionService.getById(id, user);
        return ResponseEntity.ok(ApiResponse.success(dto, "Job description retrieved successfully"));
    }
}
