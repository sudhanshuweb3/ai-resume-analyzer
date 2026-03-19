package com.analyzer.service;

import com.analyzer.domain.AnalysisResult;
import com.analyzer.domain.JobDescription;
import com.analyzer.domain.Resume;
import com.analyzer.domain.User;
import com.analyzer.dto.AiAnalysisResponse;
import com.analyzer.dto.AnalysisResultDto;
import com.analyzer.dto.AnalyzeRequest;
import com.analyzer.repository.AnalysisResultRepository;
import com.analyzer.repository.JobDescriptionRepository;
import com.analyzer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final ResumeRepository resumeRepository;
    private final JobDescriptionRepository jobDescriptionRepository;
    private final AnalysisResultRepository analysisResultRepository;
    private final AiServiceClient aiServiceClient;

    @Transactional
    public AnalysisResultDto analyze(AnalyzeRequest request, User user) {
        Resume resume = resumeRepository.findByIdAndUserId(request.getResumeId(), user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Resume not found or unauthorized"));

        JobDescription jobDescription = jobDescriptionRepository.findByIdAndUserId(request.getJobDescriptionId(), user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Job description not found or unauthorized"));

        String resumeText = resume.getExtractedText();
        if (resumeText == null || resumeText.isBlank()) {
            throw new IllegalArgumentException("Resume has no extracted text. Please re-upload your resume.");
        }

        AiAnalysisResponse aiResult = aiServiceClient.analyzeCompatibility(resumeText, jobDescription.getContent());

        int atsScore = calculateAtsScore(aiResult);

        AnalysisResult analysisResult = AnalysisResult.builder()
                .user(user)
                .resume(resume)
                .jobDescription(jobDescription)
                .atsScore(atsScore)
                .matchPercentage(aiResult.getMatchPercentage())
                .matchedKeywords(aiResult.getMatchedKeywords())
                .missingKeywords(aiResult.getMissingKeywords())
                .build();

        analysisResult = analysisResultRepository.save(analysisResult);
        return mapToDto(analysisResult);
    }

    @Transactional(readOnly = true)
    public List<AnalysisResultDto> getUserHistory(User user) {
        return analysisResultRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AnalysisResultDto getResult(UUID resultId, User user) {
        AnalysisResult result = analysisResultRepository.findByIdAndUserId(resultId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Analysis result not found or unauthorized"));
        return mapToDto(result);
    }

    private int calculateAtsScore(AiAnalysisResponse aiResult) {
        double matchPercentage = aiResult.getMatchPercentage();
        int penalty = aiResult.getReadabilityPenalty();
        // The AI service returns 0-100. Subtract readability penalty.
        return (int) Math.max(0, Math.min(100, matchPercentage - penalty));
    }

    private AnalysisResultDto mapToDto(AnalysisResult result) {
        return AnalysisResultDto.builder()
                .id(result.getId())
                .resumeId(result.getResume().getId())
                .jobDescriptionId(result.getJobDescription().getId())
                .resumeFileName(result.getResume().getOriginalFileName())
                .jobDescriptionTitle(result.getJobDescription().getTitle())
                .atsScore(result.getAtsScore())
                .matchPercentage(result.getMatchPercentage())
                .matchedKeywords(result.getMatchedKeywords())
                .missingKeywords(result.getMissingKeywords())
                .createdAt(result.getCreatedAt())
                .build();
    }
}
