package com.analyzer.controller;

import com.analyzer.domain.User;
import com.analyzer.dto.ApiResponse;
import com.analyzer.dto.ResumeDto;
import com.analyzer.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping
    public ResponseEntity<ApiResponse<ResumeDto>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user
    ) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }

        if (!file.getOriginalFilename().toLowerCase().endsWith(".pdf") && 
            !file.getOriginalFilename().toLowerCase().endsWith(".docx")) {
            throw new IllegalArgumentException("Only PDF and DOCX files are allowed");
        }

        ResumeDto resumeDto = resumeService.saveResume(file, user);
        return ResponseEntity.ok(ApiResponse.success(resumeDto, "Resume uploaded successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResumeDto>>> getUserResumes(
            @AuthenticationPrincipal User user
    ) {
        List<ResumeDto> resumes = resumeService.getUserResumes(user);
        return ResponseEntity.ok(ApiResponse.success(resumes, "Resumes retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResumeDto>> getResume(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        ResumeDto resumeDto = resumeService.getResume(id, user);
        return ResponseEntity.ok(ApiResponse.success(resumeDto, "Resume retrieved successfully"));
    }
}
