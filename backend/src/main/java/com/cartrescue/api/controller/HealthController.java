package com.cartrescue.api.controller;

import com.cartrescue.api.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
@Tag(name = "Health Check", description = "System diagnostic health check API")
public class HealthController {

    @GetMapping
    @Operation(summary = "System health check status")
    public ResponseEntity<ApiResponse<Map<String, String>>> checkHealth() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "CartRescue Backend API");
        status.put("version", "1.0.0");
        return ResponseEntity.ok(ApiResponse.success("System is operational", status));
    }
}
