package com.analyzer.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnalyzeRequest {

    @NotNull(message = "Resume ID is required")
    private UUID resumeId;

    @NotNull(message = "Job Description ID is required")
    private UUID jobDescriptionId;
}
