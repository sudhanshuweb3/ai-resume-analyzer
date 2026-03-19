package com.analyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AiAnalysisResponse {
    private double matchPercentage;
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private int readabilityPenalty;
}
