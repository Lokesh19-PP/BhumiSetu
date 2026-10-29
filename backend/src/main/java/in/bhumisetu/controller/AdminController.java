package in.bhumisetu.controller;

import in.bhumisetu.dto.admin.AdminAuditLogDto;
import in.bhumisetu.dto.admin.AdminUserDto;
import in.bhumisetu.dto.admin.AnalyticsDto;
import in.bhumisetu.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin & Analytics Service", description = "Endpoints for municipal analytics, aggregated service charts, user directory, and immutable audit logs. Restricted to ADMIN.")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/analytics")
    @Operation(summary = "Get system analytics & chart metrics", description = "Aggregates applications by service type, status distribution, department throughput, and processing time")
    public ResponseEntity<AnalyticsDto> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    @GetMapping("/users")
    @Operation(summary = "Get registered users directory", description = "Lists all registered citizen and officer accounts with role metadata")
    public ResponseEntity<List<AdminUserDto>> getUsers() {
        return ResponseEntity.ok(adminService.getUsers());
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Get immutable system audit logs", description = "Retrieves chronological security and workflow audit trail with IP address and action timestamps")
    public ResponseEntity<List<AdminAuditLogDto>> getAuditLogs() {
        return ResponseEntity.ok(adminService.getAuditLogs());
    }
}
