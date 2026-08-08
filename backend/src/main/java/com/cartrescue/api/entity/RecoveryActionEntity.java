package com.cartrescue.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "recovery_actions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecoveryActionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "action_id")
    private Long actionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private SessionEntity session;

    @Column(name = "action_type", nullable = false, length = 40)
    private String actionType;

    @Column(nullable = false, length = 20)
    private String channel;

    @Column(nullable = false, length = 100)
    private String recipient;

    @Column(length = 20)
    private String status = "SENT";

    @Column(name = "payload_json", columnDefinition = "TEXT")
    private String payloadJson;

    @Column(name = "estimated_margin_impact", precision = 10, scale = 2)
    private BigDecimal estimatedMarginImpact = BigDecimal.ZERO;

    @Column(name = "triggered_at", insertable = false, updatable = false)
    private LocalDateTime triggeredAt;
}
