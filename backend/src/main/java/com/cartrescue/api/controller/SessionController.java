package com.cartrescue.api.controller;

import com.cartrescue.api.dto.ApiResponse;
import com.cartrescue.api.dto.SessionDTO;
import com.cartrescue.api.service.SessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
@Tag(name = "Sessions", description = "Clickstream session retrieval and tracking APIs")
public class SessionController {

    private final SessionService sessionService;

    @GetMapping
    @Operation(summary = "Get paginated clickstream sessions")
    public ResponseEntity<ApiResponse<Page<SessionDTO>>> getAllSessions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        Page<SessionDTO> sessions = sessionService.getAllSessions(page, size, status);
        return ResponseEntity.ok(ApiResponse.success("Sessions retrieved successfully", sessions));
    }

    @GetMapping("/{sessionId}")
    @Operation(summary = "Get detailed session by ID")
    public ResponseEntity<ApiResponse<SessionDTO>> getSessionById(@PathVariable String sessionId) {
        SessionDTO session = sessionService.getSessionById(sessionId);
        return ResponseEntity.ok(ApiResponse.success("Session details retrieved", session));
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recent active sessions")
    public ResponseEntity<ApiResponse<List<SessionDTO>>> getRecentSessions() {
        List<SessionDTO> recent = sessionService.getRecentSessions();
        return ResponseEntity.ok(ApiResponse.success("Recent sessions retrieved", recent));
    }

    @PostMapping("/simulate")
    @Operation(summary = "Simulate new live shopping clickstream session")
    public ResponseEntity<ApiResponse<SessionDTO>> simulateLiveSession() {
        SessionDTO simulated = sessionService.simulateLiveSession();
        return ResponseEntity.ok(ApiResponse.success("New live clickstream session simulated", simulated));
    }
}
