package com.cartrescue.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionDTO {
    private String sessionId;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String deviceType;
    private String operatingSystem;
    private Integer sessionDurationSec;
    private BigDecimal cartValue;
    private Integer itemsCount;
    private Integer checkoutAttempts;
    private Integer paymentFailures;
    private Integer cartRevisitCount;
    private Boolean isWeekend;
    private Boolean isNight;
    private Boolean isAbandoned;
    private String status;
}
