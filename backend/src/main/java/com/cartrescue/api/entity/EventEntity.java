package com.cartrescue.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long eventId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private SessionEntity session;

    @Column(name = "event_type", nullable = false, length = 40)
    private String eventType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private ProductEntity product;

    @Column(name = "event_time")
    private LocalDateTime eventTime;

    @Column(name = "item_price", precision = 10, scale = 2)
    private BigDecimal itemPrice = BigDecimal.ZERO;

    @Column(name = "metadata_json", columnDefinition = "TEXT")
    private String metadataJson;
}
