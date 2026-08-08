package com.cartrescue.api.service;

import com.cartrescue.api.dto.InterventionRequestDTO;
import com.cartrescue.api.dto.InterventionResponseDTO;
import com.cartrescue.api.entity.RecoveryActionEntity;
import com.cartrescue.api.entity.SessionEntity;
import com.cartrescue.api.exception.ResourceNotFoundException;
import com.cartrescue.api.repository.RecoveryActionRepository;
import com.cartrescue.api.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class InterventionService {

    private final SessionRepository sessionRepository;
    private final RecoveryActionRepository recoveryActionRepository;

    public InterventionResponseDTO triggerRecoveryIntervention(InterventionRequestDTO request) {
        SessionEntity session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with ID: " + request.getSessionId()));

        RecoveryActionEntity entity = RecoveryActionEntity.builder()
                .session(session)
                .actionType(request.getActionType())
                .channel(request.getChannel())
                .recipient(request.getRecipient())
                .status("SENT")
                .estimatedMarginImpact(request.getEstimatedMarginImpact() != null ?
                        BigDecimal.valueOf(request.getEstimatedMarginImpact()) : BigDecimal.ZERO)
                .build();

        // Update session status to RECOVERED to reflect successful intervention
        session.setStatus("RECOVERED");
        session.setIsAbandoned(false);
        sessionRepository.save(session);

        RecoveryActionEntity saved = recoveryActionRepository.save(entity);

        return InterventionResponseDTO.builder()
                .actionId(saved.getActionId())
                .sessionId(session.getSessionId())
                .actionType(saved.getActionType())
                .channel(saved.getChannel())
                .recipient(saved.getRecipient())
                .status(saved.getStatus())
                .estimatedMarginImpact(saved.getEstimatedMarginImpact().doubleValue())
                .triggeredAt(LocalDateTime.now())
                .build();
    }
}
