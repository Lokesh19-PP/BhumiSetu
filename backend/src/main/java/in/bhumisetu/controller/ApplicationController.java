package in.bhumisetu.controller;

import in.bhumisetu.domain.entity.User;
import in.bhumisetu.domain.enums.ApplicationStatus;
import in.bhumisetu.dto.application.ApplicationDto;
import in.bhumisetu.dto.application.CreateApplicationRequest;
import in.bhumisetu.dto.application.OfficerDecisionRequest;
import in.bhumisetu.security.UserDetailsImpl;
import in.bhumisetu.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Tag(name = "Application & Workflow Service", description = "Endpoints for single-window application submission, automatic departmental routing, and officer decisions")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @Operation(summary = "Submit new land service application", description = "Citizen submits application for Building Permission, Land-Use Change, or Water Connection; automatically routes to respective department")
    public ResponseEntity<ApplicationDto> createApplication(
            @Valid @RequestBody CreateApplicationRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User applicant = userDetails != null ? userDetails.getUser() : null;
        ApplicationDto created = applicationService.createApplication(request, applicant);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/my")
    @Operation(summary = "Get citizen's applications", description = "Lists all land service applications submitted by the logged-in citizen")
    public ResponseEntity<List<ApplicationDto>> getMyApplications(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User applicant = userDetails != null ? userDetails.getUser() : null;
        return ResponseEntity.ok(applicationService.getMyApplications(applicant));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get application by ID", description = "Retrieves full application details with parcel dossier, uploaded documents, and complete workflow history timeline")
    public ResponseEntity<ApplicationDto> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @GetMapping("/track/{appNumber}")
    @Operation(summary = "Track application by number", description = "Public / Citizen tracking endpoint to view application status and decision history by reference number (e.g. BS-2026-BP-00101)")
    public ResponseEntity<ApplicationDto> trackByApplicationNumber(
            @Parameter(description = "Application tracking number e.g. BS-2026-BP-00101")
            @PathVariable String appNumber) {
        return ResponseEntity.ok(applicationService.trackByApplicationNumber(appNumber));
    }

    @GetMapping("/officer/queue")
    @PreAuthorize("hasAnyRole('PLANNING_OFFICER', 'REVENUE_OFFICER', 'UTILITY_OFFICER', 'TREE_OFFICER', 'ADMIN')")
    @Operation(summary = "Get officer review queue", description = "Returns pending applications filtered by the officer's department. Citizens are strictly forbidden.")
    public ResponseEntity<List<ApplicationDto>> getOfficerQueue(
            @RequestParam(value = "status", required = false) ApplicationStatus status,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User officer = userDetails != null ? userDetails.getUser() : null;
        return ResponseEntity.ok(applicationService.getOfficerQueue(officer, status));
    }

    @PostMapping("/{id}/decision")
    @PreAuthorize("hasAnyRole('PLANNING_OFFICER', 'REVENUE_OFFICER', 'UTILITY_OFFICER', 'TREE_OFFICER', 'ADMIN')")
    @Operation(summary = "Officer action & workflow decision", description = "Department officer approves, rejects, or requests additional information. Citizens are strictly forbidden.")
    public ResponseEntity<ApplicationDto> takeDecision(
            @PathVariable Long id,
            @Valid @RequestBody OfficerDecisionRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User officer = userDetails != null ? userDetails.getUser() : null;
        return ResponseEntity.ok(applicationService.takeDecision(id, request, officer));
    }
}
