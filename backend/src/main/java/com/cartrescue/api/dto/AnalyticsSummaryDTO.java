package com.cartrescue.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsSummaryDTO {
    private Long totalSessions;
    private Long totalAbandonedSessions;
    private Double abandonmentRate;
    private Double totalAbandonedCartValue;
    private Double totalRecoveredMargin;
    private Map<String, Long> intentBreakdown;
    private Map<String, Long> actionBreakdown;
}
