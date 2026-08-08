package com.cartrescue.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InterventionRequestDTO {
    @NotBlank(message = "Session ID is required")
    private String sessionId;

    @NotBlank(message = "Action type is required")
    private String actionType;

    @NotBlank(message = "Channel is required")
    private String channel;

    @NotBlank(message = "Recipient contact is required")
    private String recipient;

    private Double estimatedMarginImpact;
}
