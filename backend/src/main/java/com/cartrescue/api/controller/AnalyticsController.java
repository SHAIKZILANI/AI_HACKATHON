package com.cartrescue.api.controller;

import com.cartrescue.api.dto.AnalyticsSummaryDTO;
import com.cartrescue.api.dto.ApiResponse;
import com.cartrescue.api.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Executive Dashboard Analytics & Key Performance Indicators")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    @Operation(summary = "Get executive dashboard KPIs and intent/action breakdowns")
    public ResponseEntity<ApiResponse<AnalyticsSummaryDTO>> getSummary() {
        AnalyticsSummaryDTO summary = analyticsService.getAnalyticsSummary();
        return ResponseEntity.ok(ApiResponse.success("Analytics summary retrieved", summary));
    }
}
