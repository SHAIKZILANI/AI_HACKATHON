package com.cartrescue.api.service;

import com.cartrescue.api.dto.PredictionResponseDTO;
import com.cartrescue.api.entity.CustomerEntity;
import com.cartrescue.api.entity.PredictionEntity;
import com.cartrescue.api.entity.SessionEntity;
import com.cartrescue.api.exception.ResourceNotFoundException;
import com.cartrescue.api.repository.PredictionRepository;
import com.cartrescue.api.repository.SessionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PredictionService {

    private final SessionRepository sessionRepository;
    private final PredictionRepository predictionRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.ml-service.url}")
    private String mlServiceUrl;

    public PredictionResponseDTO predictSessionAbandonmentRisk(String sessionId) {
        SessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with ID: " + sessionId));

        CustomerEntity customer = session.getCustomer();

        Map<String, Object> mlPayload = new HashMap<>();
        mlPayload.put("session_id", session.getSessionId());
        mlPayload.put("customer_id", customer != null ? customer.getCustomerId() : 1);
        mlPayload.put("session_duration_sec", session.getSessionDurationSec() != null ? session.getSessionDurationSec() : 300);
        mlPayload.put("cart_value", session.getCartValue() != null ? session.getCartValue().doubleValue() : 0.0);
        mlPayload.put("items_count", session.getItemsCount() != null ? session.getItemsCount() : 1);
        mlPayload.put("checkout_attempts", session.getCheckoutAttempts() != null ? session.getCheckoutAttempts() : 0);
        mlPayload.put("payment_failures", session.getPaymentFailures() != null ? session.getPaymentFailures() : 0);
        mlPayload.put("cart_revisit_count", session.getCartRevisitCount() != null ? session.getCartRevisitCount() : 1);
        mlPayload.put("is_weekend", Boolean.TRUE.equals(session.getIsWeekend()) ? 1 : 0);
        mlPayload.put("is_night", Boolean.TRUE.equals(session.getIsNight()) ? 1 : 0);
        mlPayload.put("customer_total_orders", customer != null && customer.getTotalOrders() != null ? customer.getTotalOrders() : 0);
        mlPayload.put("customer_total_spent", customer != null && customer.getTotalSpent() != null ? customer.getTotalSpent().doubleValue() : 0.0);
        mlPayload.put("customer_aov", customer != null && customer.getAverageOrderValue() != null ? customer.getAverageOrderValue().doubleValue() : 0.0);
        mlPayload.put("customer_clv", customer != null && customer.getCustomerLifetimeValue() != null ? customer.getCustomerLifetimeValue().doubleValue() : 0.0);

        PredictionResponseDTO response;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(mlPayload, headers);

            Map<String, Object> mlResult = restTemplate.postForObject(mlServiceUrl + "/predict", requestEntity, Map.class);
            response = mapMlResultToDTO(mlResult, sessionId);
        } catch (Exception ex) {
            // Fallback rule-based engine if Python ML service is offline
            response = fallbackRuleEngine(session, customer);
        }

        // Persist or Update prediction record in MySQL database
        savePredictionRecord(session, response);

        return response;
    }

    private void savePredictionRecord(SessionEntity session, PredictionResponseDTO dto) {
        Optional<PredictionEntity> existing = predictionRepository.findBySessionSessionId(session.getSessionId());

        PredictionEntity entity = existing.orElseGet(() -> PredictionEntity.builder().session(session).build());
        entity.setAbandonmentRiskScore(dto.getAbandonmentRiskScore());
        entity.setIntentCategory(dto.getIntentCategory());
        entity.setRecommendedAction(dto.getRecommendedAction());
        entity.setConfidenceScore(dto.getRecommendationConfidence());
        entity.setHumanReason(dto.getHumanReason());
        entity.setExpectedImpact(dto.getExpectedImpact());

        try {
            entity.setTopFeaturesJson(objectMapper.writeValueAsString(dto.getTopFeatures()));
        } catch (Exception e) {
            entity.setTopFeaturesJson("[]");
        }

        predictionRepository.save(entity);
    }

    private PredictionResponseDTO mapMlResultToDTO(Map<String, Object> mlResult, String sessionId) {
        return PredictionResponseDTO.builder()
                .sessionId(sessionId)
                .abandonmentRiskScore(BigDecimal.valueOf(((Number) mlResult.get("abandonment_risk_score")).doubleValue()))
                .intentCategory((String) mlResult.get("intent_category"))
                .intentConfidence(BigDecimal.valueOf(((Number) mlResult.get("intent_confidence")).doubleValue()))
                .intentExplanation((String) mlResult.get("intent_explanation"))
                .recommendedAction((String) mlResult.get("recommended_action"))
                .recommendationReason((String) mlResult.get("recommendation_reason"))
                .expectedImpact((String) mlResult.get("expected_impact"))
                .recommendationConfidence(BigDecimal.valueOf(((Number) mlResult.get("recommendation_confidence")).doubleValue()))
                .channel((String) mlResult.get("channel"))
                .humanReason((String) mlResult.get("human_reason"))
                .topFeatures((List<Object>) mlResult.get("top_features"))
                .build();
    }

    private PredictionResponseDTO fallbackRuleEngine(SessionEntity session, CustomerEntity customer) {
        double risk = 0.40;
        int pf = session.getPaymentFailures() != null ? session.getPaymentFailures() : 0;
        double cv = session.getCartValue() != null ? session.getCartValue().doubleValue() : 0.0;

        if (pf > 0) risk = 0.94;
        else if (cv > 15000) risk = 0.78;

        String intent = pf > 0 ? "Payment Issue" : (risk > 0.70 ? "Price Sensitive" : "Buy Now");
        String action = pf > 0 ? "Retry Payment" : (risk > 0.70 ? "Offer Coupon" : "Do Nothing");

        return PredictionResponseDTO.builder()
                .sessionId(session.getSessionId())
                .abandonmentRiskScore(BigDecimal.valueOf(risk))
                .intentCategory(intent)
                .intentConfidence(BigDecimal.valueOf(0.90))
                .intentExplanation("Diagnosed via rule engine fallback")
                .recommendedAction(action)
                .recommendationReason("Fallback heuristic policy")
                .expectedImpact("High GMV protection")
                .recommendationConfidence(BigDecimal.valueOf(0.85))
                .channel(pf > 0 ? "WhatsApp" : "In-App Nudge")
                .humanReason("Fallback prediction due to microservice offline state.")
                .topFeatures(Collections.emptyList())
                .build();
    }
}
