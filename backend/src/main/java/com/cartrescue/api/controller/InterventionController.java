package com.cartrescue.api.controller;

import com.cartrescue.api.dto.ApiResponse;
import com.cartrescue.api.dto.InterventionRequestDTO;
import com.cartrescue.api.dto.InterventionResponseDTO;
import com.cartrescue.api.service.InterventionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/interventions")
@RequiredArgsConstructor
@Tag(name = "Interventions", description = "Trigger policy-bounded automated cart recovery actions")
public class InterventionController {

    private final InterventionService interventionService;

    @PostMapping("/trigger")
    @Operation(summary = "Trigger automated intervention nudge (WhatsApp/SMS/Email/Coupon)")
    public ResponseEntity<ApiResponse<InterventionResponseDTO>> triggerIntervention(
            @Valid @RequestBody InterventionRequestDTO request) {
        InterventionResponseDTO response = interventionService.triggerRecoveryIntervention(request);
        return ResponseEntity.ok(ApiResponse.success("Intervention triggered successfully", response));
    }
}
