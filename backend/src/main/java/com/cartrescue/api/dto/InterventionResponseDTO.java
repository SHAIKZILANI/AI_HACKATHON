package com.cartrescue.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterventionResponseDTO {
    private Long actionId;
    private String sessionId;
    private String actionType;
    private String channel;
    private String recipient;
    private String status;
    private Double estimatedMarginImpact;
    private LocalDateTime triggeredAt;
}
