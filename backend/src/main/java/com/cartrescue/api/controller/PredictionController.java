package com.cartrescue.api.controller;

import com.cartrescue.api.dto.ApiResponse;
import com.cartrescue.api.dto.PredictionResponseDTO;
import com.cartrescue.api.service.PredictionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/predictions")
@RequiredArgsConstructor
@Tag(name = "Predictions", description = "Machine Learning Abandonment Scoring & Diagnostics APIs")
public class PredictionController {

    private final PredictionService predictionService;

    @PostMapping("/predict/{sessionId}")
    @Operation(summary = "Predict real-time abandonment risk, intent category & recommendations")
    public ResponseEntity<ApiResponse<PredictionResponseDTO>> predictSessionRisk(@PathVariable String sessionId) {
        PredictionResponseDTO response = predictionService.predictSessionAbandonmentRisk(sessionId);
        return ResponseEntity.ok(ApiResponse.success("Prediction generated successfully", response));
    }
}
