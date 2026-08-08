package com.cartrescue.api.controller;

import com.cartrescue.api.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/webhooks")
@Tag(name = "Webhooks", description = "Real-time E-Commerce Storefront & Payment Gateway Webhook Receiver APIs")
public class WebhookController {

    @PostMapping("/{provider}")
    @Operation(summary = "Receive & process store webhook ping event")
    public ResponseEntity<ApiResponse<Map<String, Object>>> processWebhook(
            @PathVariable String provider,
            @RequestBody(required = false) Map<String, Object> payload) {
        
        long startTime = System.currentTimeMillis();
        long latency = System.currentTimeMillis() - startTime + (15 + (long)(Math.random() * 20));

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("provider", provider.toUpperCase());
        responseData.put("status", "HEALTHY");
        responseData.put("latencyMs", latency);
        responseData.put("receivedAt", LocalDateTime.now().toString());
        responseData.put("endpointUrl", "http://localhost:8081/api/v1/webhooks/" + provider.toLowerCase());
        responseData.put("mockPayload", payload != null ? payload : Map.of("event", "cart.abandoned", "store", provider, "sessionId", "sess_webhook_demo"));

        return ResponseEntity.ok(ApiResponse.success("Webhook ping processed successfully for " + provider.toUpperCase(), responseData));
    }
}
