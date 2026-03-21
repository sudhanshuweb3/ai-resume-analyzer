package com.analyzer.service;

import com.analyzer.domain.JobDescription;
import com.analyzer.domain.User;
import com.analyzer.dto.JobDescriptionDto;
import com.analyzer.dto.JobDescriptionRequest;
import com.analyzer.repository.JobDescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobDescriptionService {

    private final JobDescriptionRepository jobDescriptionRepository;

    @Transactional
    public JobDescriptionDto save(JobDescriptionRequest request, User user) {
        JobDescription jd = JobDescription.builder()
                .user(user)
                .title(request.getTitle())
                .content(request.getContent())
                .build();

        jd = jobDescriptionRepository.save(jd);
        return mapToDto(jd);
    }

    @Transactional(readOnly = true)
    public List<JobDescriptionDto> getUserJobDescriptions(User user) {
        return jobDescriptionRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JobDescriptionDto getById(UUID id, User user) {
        JobDescription jd = jobDescriptionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Job description not found or unauthorized"));
        return mapToDto(jd);
    }

    private JobDescriptionDto mapToDto(JobDescription jd) {
        return JobDescriptionDto.builder()
                .id(jd.getId())
                .title(jd.getTitle())
                .content(jd.getContent())
                .createdAt(jd.getCreatedAt())
                .build();
    }
}
