package com.cartrescue.api.service;

import com.cartrescue.api.dto.AnalyticsSummaryDTO;
import com.cartrescue.api.repository.PredictionRepository;
import com.cartrescue.api.repository.RecoveryActionRepository;
import com.cartrescue.api.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final SessionRepository sessionRepository;
    private final PredictionRepository predictionRepository;
    private final RecoveryActionRepository recoveryActionRepository;

    public AnalyticsSummaryDTO getAnalyticsSummary() {
        Long totalSessions = sessionRepository.countTotalSessions();
        Long abandonedSessions = sessionRepository.countAbandonedSessions();
        Double totalAbandonedValue = sessionRepository.calculateTotalAbandonedCartValue();
        Double totalRecoveredMargin = recoveryActionRepository.calculateTotalRecoveredMargin();

        if (totalSessions == null) totalSessions = 0L;
        if (abandonedSessions == null) abandonedSessions = 0L;
        if (totalAbandonedValue == null) totalAbandonedValue = 0.0;
        if (totalRecoveredMargin == null) totalRecoveredMargin = 0.0;

        double rate = totalSessions > 0 ? (double) abandonedSessions / totalSessions * 100.0 : 0.0;

        // Intent breakdown aggregation
        List<Object[]> rawIntentCounts = predictionRepository.countGroupByIntentCategory();
        Map<String, Long> intentMap = new HashMap<>();
        for (Object[] row : rawIntentCounts) {
            intentMap.put((String) row[0], (Long) row[1]);
        }

        // Action breakdown aggregation
        List<Object[]> rawActionCounts = predictionRepository.countGroupByRecommendedAction();
        Map<String, Long> actionMap = new HashMap<>();
        for (Object[] row : rawActionCounts) {
            actionMap.put((String) row[0], (Long) row[1]);
        }

        return AnalyticsSummaryDTO.builder()
                .totalSessions(totalSessions)
                .totalAbandonedSessions(abandonedSessions)
                .abandonmentRate(Math.round(rate * 100.0) / 100.0)
                .totalAbandonedCartValue(totalAbandonedValue)
                .totalRecoveredMargin(totalRecoveredMargin)
                .intentBreakdown(intentMap)
                .actionBreakdown(actionMap)
                .build();
    }
}
