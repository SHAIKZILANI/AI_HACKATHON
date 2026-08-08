package com.cartrescue.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PredictionResponseDTO {
    private String sessionId;
    private BigDecimal abandonmentRiskScore;
    private String intentCategory;
    private BigDecimal intentConfidence;
    private String intentExplanation;
    private String recommendedAction;
    private String recommendationReason;
    private String expectedImpact;
    private BigDecimal recommendationConfidence;
    private String channel;
    private String humanReason;
    private List<Object> topFeatures;
}
