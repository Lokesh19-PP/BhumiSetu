package in.bhumisetu.service;

import in.bhumisetu.domain.entity.*;
import in.bhumisetu.domain.enums.ApplicationStatus;
import in.bhumisetu.domain.enums.Role;
import in.bhumisetu.domain.enums.ServiceType;
import in.bhumisetu.dto.application.ApplicationDto;
import in.bhumisetu.dto.application.CreateApplicationRequest;
import in.bhumisetu.dto.application.OfficerDecisionRequest;
import in.bhumisetu.dto.parcel.DocumentDto;
import in.bhumisetu.exception.BadRequestException;
import in.bhumisetu.exception.ResourceNotFoundException;
import in.bhumisetu.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final LandParcelRepository landParcelRepository;
    private final DepartmentRepository departmentRepository;
    private final WorkflowHistoryRepository workflowHistoryRepository;
    private final DocumentRepository documentRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public ApplicationDto createApplication(CreateApplicationRequest request, User applicant) {
        if (applicant == null) {
            throw new AccessDeniedException("User must be authenticated to submit an application");
        }

        LandParcel parcel = landParcelRepository.findById(request.getParcelId())
                .orElseThrow(() -> new ResourceNotFoundException("Land parcel not found with ID: " + request.getParcelId()));

        // Determine destination department based on Service Type
        String departmentCode = switch (request.getServiceType()) {
            case BUILDING_PERMISSION -> "PLANNING";
            case LAND_USE_CHANGE -> "REVENUE";
            case WATER_CONNECTION -> "UTILITY";
        };

        Department department = departmentRepository.findByCode(departmentCode)
                .orElseThrow(() -> new ResourceNotFoundException("Target department not found: " + departmentCode));

        // Generate sequential application number
        String prefix = switch (request.getServiceType()) {
            case BUILDING_PERMISSION -> "BP";
            case LAND_USE_CHANGE -> "LU";
            case WATER_CONNECTION -> "WC";
        };
        long nextSeq = 100 + applicationRepository.count() + 1;
        String appNumber = String.format("BS-2026-%s-%05d", prefix, nextSeq);

        Application application = Application.builder()
                .applicationNumber(appNumber)
                .parcel(parcel)
                .applicant(applicant)
                .serviceType(request.getServiceType())
                .status(ApplicationStatus.SUBMITTED)
                .department(department)
                .remarks(request.getRemarks())
                .proposedLandUse(request.getProposedLandUse())
                .buildingHeightM(request.getBuildingHeightM())
                .builtUpAreaSqM(request.getBuiltUpAreaSqM())
                .waterConnectionType(request.getWaterConnectionType())
                .build();

        Application savedApp = applicationRepository.save(application);

        // Record initial submission in workflow history
        WorkflowHistory initialHistory = WorkflowHistory.builder()
                .application(savedApp)
                .action("SUBMITTED")
                .actedBy(applicant)
                .comment("Application submitted by citizen for " + request.getServiceType().getDisplayName())
                .timestamp(LocalDateTime.now())
                .build();
        workflowHistoryRepository.save(initialHistory);

        savedApp.getWorkflowHistories().add(initialHistory);

        // Audit Log
        auditLogService.logAction(
                applicant.getId(),
                applicant.getEmail(),
                "APPLICATION_SUBMITTED",
                "Application",
                String.valueOf(savedApp.getId()),
                "127.0.0.1",
                "Submitted application " + appNumber + " routed to " + department.getName()
        );

        log.info("Application {} submitted by {} and routed to department {}", appNumber, applicant.getEmail(), departmentCode);

        return enrichWithDocuments(savedApp);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto> getMyApplications(User applicant) {
        if (applicant == null) return List.of();
        return applicationRepository.findByApplicantIdOrderByCreatedAtDesc(applicant.getId())
                .stream()
                .map(this::enrichWithDocuments)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ApplicationDto getApplicationById(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + id));
        return enrichWithDocuments(application);
    }

    @Transactional(readOnly = true)
    public ApplicationDto trackByApplicationNumber(String appNumber) {
        Application application = applicationRepository.findByApplicationNumber(appNumber)
                .orElseThrow(() -> new ResourceNotFoundException("No application found with tracking number: " + appNumber));
        return enrichWithDocuments(application);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto> getOfficerQueue(User officer, ApplicationStatus statusFilter) {
        if (officer == null) {
            throw new AccessDeniedException("Authentication required for officer review queue");
        }

        if (officer.getRole() == Role.CITIZEN) {
            throw new AccessDeniedException("Citizens are not authorized to view the departmental officer queue");
        }

        if (officer.getRole() == Role.ADMIN) {
            if (statusFilter != null) {
                return applicationRepository.findByStatusOrderByCreatedAtDesc(statusFilter).stream()
                        .map(this::enrichWithDocuments)
                        .collect(Collectors.toList());
            }
            return applicationRepository.findAll().stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .map(this::enrichWithDocuments)
                    .collect(Collectors.toList());
        }

        // Determine officer's department code
        String deptCode = switch (officer.getRole()) {
            case PLANNING_OFFICER -> "PLANNING";
            case REVENUE_OFFICER -> "REVENUE";
            case UTILITY_OFFICER -> "UTILITY";
            case TREE_OFFICER -> "TREE";
            default -> "REVENUE";
        };

        Department department = departmentRepository.findByCode(deptCode)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found for officer: " + deptCode));

        List<Application> applications;
        if (statusFilter != null) {
            applications = applicationRepository.findByDepartmentIdAndStatusOrderByCreatedAtDesc(department.getId(), statusFilter);
        } else {
            applications = applicationRepository.findByDepartmentIdOrderByCreatedAtDesc(department.getId());
        }

        return applications.stream()
                .map(this::enrichWithDocuments)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationDto takeDecision(Long applicationId, OfficerDecisionRequest request, User officer) {
        if (officer == null) {
            throw new AccessDeniedException("Authentication required to take workflow decision");
        }

        // Strict role validation
        if (officer.getRole() == Role.CITIZEN) {
            throw new AccessDeniedException("Unauthorized: Citizens are strictly prohibited from approving or deciding applications.");
        }

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        // Check department match unless Admin
        if (officer.getRole() != Role.ADMIN) {
            String officerDept = switch (officer.getRole()) {
                case PLANNING_OFFICER -> "PLANNING";
                case REVENUE_OFFICER -> "REVENUE";
                case UTILITY_OFFICER -> "UTILITY";
                case TREE_OFFICER -> "TREE";
                default -> "";
            };
            if (!application.getDepartment().getCode().equalsIgnoreCase(officerDept)) {
                throw new AccessDeniedException("Unauthorized: You belong to " + officerDept + " and cannot act on " + application.getDepartment().getName() + " applications.");
            }
        }

        String action = request.getAction().toUpperCase().trim();
        ApplicationStatus newStatus;

        switch (action) {
            case "APPROVE" -> newStatus = ApplicationStatus.APPROVED;
            case "REJECT" -> newStatus = ApplicationStatus.REJECTED;
            case "REQUEST_INFO" -> newStatus = ApplicationStatus.INFO_REQUESTED;
            case "START_REVIEW" -> newStatus = ApplicationStatus.UNDER_REVIEW;
            default -> throw new BadRequestException("Invalid decision action: " + action + ". Allowed: APPROVE, REJECT, REQUEST_INFO, START_REVIEW");
        }

        application.setStatus(newStatus);
        application.setAssignedOfficer(officer);
        if (request.getComment() != null && !request.getComment().isBlank()) {
            application.setRemarks(request.getComment());
        }

        Application updatedApp = applicationRepository.save(application);

        // Record history
        WorkflowHistory history = WorkflowHistory.builder()
                .application(updatedApp)
                .action(action)
                .actedBy(officer)
                .comment(request.getComment())
                .timestamp(LocalDateTime.now())
                .build();
        workflowHistoryRepository.save(history);

        updatedApp.getWorkflowHistories().add(history);

        // Audit Log
        auditLogService.logAction(
                officer.getId(),
                officer.getEmail(),
                "WORKFLOW_DECISION_" + action,
                "Application",
                String.valueOf(updatedApp.getId()),
                "127.0.0.1",
                "Officer " + officer.getFullName() + " marked application " + updatedApp.getApplicationNumber() + " as " + newStatus
        );

        log.info("Application {} updated to {} by officer {}", updatedApp.getApplicationNumber(), newStatus, officer.getEmail());

        return enrichWithDocuments(updatedApp);
    }

    private ApplicationDto enrichWithDocuments(Application application) {
        ApplicationDto dto = ApplicationDto.fromEntity(application);
        if (application.getParcel() != null) {
            List<Document> docs = documentRepository.findByParcelId(application.getParcel().getId());
            dto.setDocuments(docs.stream().map(DocumentDto::fromEntity).collect(Collectors.toList()));
        }
        return dto;
    }
}
