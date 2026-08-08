package com.cartrescue.api.service;

import com.cartrescue.api.dto.SessionDTO;
import com.cartrescue.api.entity.SessionEntity;
import com.cartrescue.api.exception.ResourceNotFoundException;
import com.cartrescue.api.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;

    public Page<SessionDTO> getAllSessions(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("startTime").descending());
        Page<SessionEntity> sessionPage;

        if (status != null && !status.isEmpty()) {
            sessionPage = sessionRepository.findByStatus(status, pageable);
        } else {
            sessionPage = sessionRepository.findAll(pageable);
        }

        return sessionPage.map(this::mapToDTO);
    }

    public SessionDTO getSessionById(String sessionId) {
        SessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with ID: " + sessionId));
        return mapToDTO(session);
    }

    public List<SessionDTO> getRecentSessions() {
        return sessionRepository.findTop10ByOrderByStartTimeDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public SessionDTO simulateLiveSession() {
        long timestamp = System.currentTimeMillis() % 10000;
        String newSessionId = "sess_" + timestamp + "_live";

        java.util.Random rand = new java.util.Random();
        double[] cartValues = {12995.0, 29990.0, 41900.0, 14999.0, 3499.0};
        double cartVal = cartValues[rand.nextInt(cartValues.length)];

        // Generate varied session scenarios across 5 distinct shopper intent profiles
        int scenario = rand.nextInt(5);
        int payFailures = 0;
        int checkoutAttempts = 1;
        int revisits = 1;
        int durationSec = 150 + rand.nextInt(200);
        String status = "ACTIVE";
        boolean isAbandoned = false;

        if (scenario == 1) { // Price Sensitive
            cartVal = 29990.0;
            payFailures = 0;
            checkoutAttempts = 1;
            revisits = 3 + rand.nextInt(2);
            durationSec = 500 + rand.nextInt(300);
            status = "PRICE_SENSITIVE";
            isAbandoned = true;
        } else if (scenario == 2) { // Delivery Concern
            cartVal = 41900.0;
            payFailures = 0;
            checkoutAttempts = 2 + rand.nextInt(2);
            revisits = 2;
            durationSec = 600 + rand.nextInt(300);
            status = "SHIPPING_PAUSE";
            isAbandoned = true;
        } else if (scenario == 3) { // Buy Later
            cartVal = 14999.0;
            payFailures = 0;
            checkoutAttempts = 0;
            revisits = 3;
            durationSec = 950 + rand.nextInt(300);
            status = "SAVED_CART";
            isAbandoned = false;
        } else if (scenario == 4) { // Payment Gateway Failure (High Risk)
            cartVal = 29990.0;
            payFailures = 1 + rand.nextInt(2);
            checkoutAttempts = 2;
            revisits = 3;
            durationSec = 750 + rand.nextInt(300);
            status = "HIGH_RISK_ABANDON";
            isAbandoned = true;
        }

        SessionEntity newSession = SessionEntity.builder()
                .sessionId(newSessionId)
                .deviceType(rand.nextBoolean() ? "MOBILE" : "DESKTOP")
                .operatingSystem(rand.nextBoolean() ? "Android" : "Windows")
                .ipAddress("103.45.12." + (10 + rand.nextInt(80)))
                .startTime(java.time.LocalDateTime.now())
                .isWeekend(rand.nextBoolean())
                .isNight(rand.nextBoolean())
                .sessionDurationSec(durationSec)
                .cartValue(java.math.BigDecimal.valueOf(cartVal))
                .itemsCount(1 + rand.nextInt(3))
                .checkoutAttempts(checkoutAttempts)
                .paymentFailures(payFailures)
                .cartRevisitCount(revisits)
                .isAbandoned(isAbandoned)
                .status(status)
                .build();

        SessionEntity saved = sessionRepository.save(newSession);
        return mapToDTO(saved);
    }

    private static final String[] INDIAN_NAMES = {
        "Rahul Sharma", "Ananya Verma", "Vikramaditya Patel", "Priya Sundaram",
        "Rajesh Kumar", "Sneha Reddy", "Aarav Gupta", "Kavya Iyer",
        "Rohan Malhotra", "Meera Joshi", "Aditya Nair", "Pooja Banerjee",
        "Siddharth Rao", "Divya Menon", "Amitabh Singh", "Tanvi Kulkarni"
    };

    private SessionDTO mapToDTO(SessionEntity entity) {
        String name = "Guest Shopper";
        if (entity.getCustomer() != null) {
            name = entity.getCustomer().getFirstName() + " " + entity.getCustomer().getLastName();
        } else {
            int nameIdx = Math.abs(entity.getSessionId().hashCode()) % INDIAN_NAMES.length;
            name = INDIAN_NAMES[nameIdx];
        }

        return SessionDTO.builder()
                .sessionId(entity.getSessionId())
                .customerId(entity.getCustomer() != null ? entity.getCustomer().getCustomerId() : null)
                .customerName(name)
                .customerEmail(entity.getCustomer() != null ? entity.getCustomer().getEmail() : "shopper@cartrescue.ai")
                .deviceType(entity.getDeviceType())
                .operatingSystem(entity.getOperatingSystem())
                .sessionDurationSec(entity.getSessionDurationSec())
                .cartValue(entity.getCartValue())
                .itemsCount(entity.getItemsCount())
                .checkoutAttempts(entity.getCheckoutAttempts())
                .paymentFailures(entity.getPaymentFailures())
                .cartRevisitCount(entity.getCartRevisitCount())
                .isWeekend(entity.getIsWeekend())
                .isNight(entity.getIsNight())
                .isAbandoned(entity.getIsAbandoned())
                .status(entity.getStatus())
                .build();
    }
}
