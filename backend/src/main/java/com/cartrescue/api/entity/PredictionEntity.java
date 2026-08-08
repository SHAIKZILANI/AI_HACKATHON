package com.cartrescue.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PredictionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prediction_id")
    private Long predictionId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private SessionEntity session;

    @Column(name = "abandonment_risk_score", nullable = false, precision = 5, scale = 4)
    private BigDecimal abandonmentRiskScore;

    @Column(name = "intent_category", nullable = false, length = 40)
    private String intentCategory;

    @Column(name = "recommended_action", nullable = false, length = 40)
    private String recommendedAction;

    @Column(name = "confidence_score", nullable = false, precision = 5, scale = 4)
    private BigDecimal confidenceScore;

    @Column(name = "top_features_json", columnDefinition = "TEXT")
    private String topFeaturesJson;

    @Column(name = "human_reason", columnDefinition = "TEXT")
    private String humanReason;

    @Column(name = "expected_impact", columnDefinition = "TEXT")
    private String expectedImpact;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
