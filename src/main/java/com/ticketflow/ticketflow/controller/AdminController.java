package com.ticketflow.ticketflow.controller;

import com.ticketflow.ticketflow.dto.PendingAgentResponse;
import com.ticketflow.ticketflow.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/agents/pending")
    public ResponseEntity<List<PendingAgentResponse>> getPendingAgents() {
        return ResponseEntity.ok(adminService.getPendingAgents());
    }

    @PatchMapping("/agents/{id}/approve")
    public ResponseEntity<Void> approveAgent(@PathVariable Long id) {
        adminService.approveAgent(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/agents/{id}/reject")
    public ResponseEntity<Void> rejectAgent(@PathVariable Long id) {
        adminService.rejectAgent(id);
        return ResponseEntity.noContent().build();
    }
}