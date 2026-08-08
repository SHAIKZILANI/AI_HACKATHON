package com.cartrescue.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionEntity {

    @Id
    @Column(name = "session_id", length = 64)
    private String sessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private CustomerEntity customer;

    @Column(name = "device_type", length = 20)
    private String deviceType = "DESKTOP";

    @Column(name = "operating_system", length = 30)
    private String operatingSystem = "Windows";

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "is_weekend")
    private Boolean isWeekend = false;

    @Column(name = "is_night")
    private Boolean isNight = false;

    @Column(name = "session_duration_sec")
    private Integer sessionDurationSec = 0;

    @Column(name = "cart_value", precision = 10, scale = 2)
    private BigDecimal cartValue = BigDecimal.ZERO;

    @Column(name = "items_count")
    private Integer itemsCount = 0;

    @Column(name = "checkout_attempts")
    private Integer checkoutAttempts = 0;

    @Column(name = "payment_failures")
    private Integer paymentFailures = 0;

    @Column(name = "cart_revisit_count")
    private Integer cartRevisitCount = 0;

    @Column(name = "is_abandoned")
    private Boolean isAbandoned = false;

    @Column(length = 20)
    private String status = "ACTIVE";
}
