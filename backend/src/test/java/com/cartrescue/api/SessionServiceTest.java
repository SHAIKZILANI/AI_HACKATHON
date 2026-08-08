package com.cartrescue.api;

import com.cartrescue.api.dto.SessionDTO;
import com.cartrescue.api.entity.SessionEntity;
import com.cartrescue.api.exception.ResourceNotFoundException;
import com.cartrescue.api.repository.SessionRepository;
import com.cartrescue.api.service.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @InjectMocks
    private SessionService sessionService;

    private SessionEntity sampleSession;

    @BeforeEach
    void setUp() {
        sampleSession = SessionEntity.builder()
                .sessionId("sess_test_123")
                .cartValue(BigDecimal.valueOf(14999.00))
                .sessionDurationSec(600)
                .checkoutAttempts(1)
                .paymentFailures(0)
                .isAbandoned(true)
                .status("ABANDONED")
                .startTime(LocalDateTime.now())
                .build();
    }

    @Test
    void getSessionById_Success() {
        when(sessionRepository.findById("sess_test_123")).thenReturn(Optional.of(sampleSession));

        SessionDTO dto = sessionService.getSessionById("sess_test_123");

        assertNotNull(dto);
        assertEquals("sess_test_123", dto.getSessionId());
        assertEquals(BigDecimal.valueOf(14999.00), dto.getCartValue());
        assertTrue(dto.getIsAbandoned());
    }

    @Test
    void getSessionById_NotFound_ThrowsException() {
        when(sessionRepository.findById("invalid_id")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> sessionService.getSessionById("invalid_id"));
    }
}
