package com.analyzer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobDescriptionRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 200)
    private String title;

    @NotBlank(message = "Job description content is required")
    private String content;
}
