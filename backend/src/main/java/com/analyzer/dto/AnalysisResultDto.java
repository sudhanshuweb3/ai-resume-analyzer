package com.analyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnalysisResultDto {
    private UUID id;
    private UUID resumeId;
    private UUID jobDescriptionId;
    private String resumeFileName;
    private String jobDescriptionTitle;
    private Integer atsScore;
    private Double matchPercentage;
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private LocalDateTime createdAt;
}
