package com.analyzer.service;

import com.analyzer.domain.Resume;
import com.analyzer.domain.User;
import com.analyzer.dto.ResumeDto;
import com.analyzer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public ResumeDto saveResume(MultipartFile file, User user) {
        String filePath = fileStorageService.storeFile(file, user.getId());

        Resume resume = Resume.builder()
                .user(user)
                .originalFileName(file.getOriginalFilename())
                .filePath(filePath)
                .build();

        resume = resumeRepository.save(resume);

        return mapToDto(resume);
    }

    @Transactional(readOnly = true)
    public List<ResumeDto> getUserResumes(User user) {
        return resumeRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ResumeDto getResume(UUID resumeId, User user) {
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Resume not found or unauthorized"));
        return mapToDto(resume);
    }

    private ResumeDto mapToDto(Resume resume) {
        return ResumeDto.builder()
                .id(resume.getId())
                .userId(resume.getUser().getId())
                .originalFileName(resume.getOriginalFileName())
                .createdAt(resume.getCreatedAt())
                .build();
    }
}
