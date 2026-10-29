package in.bhumisetu.dto.parcel;

import in.bhumisetu.domain.entity.Application;
import in.bhumisetu.domain.enums.ApplicationStatus;
import in.bhumisetu.domain.enums.ServiceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDto {
    private Long id;
    private String applicationNumber;
    private Long parcelId;
    private String parcelUlpin;
    private String parcelSurveyNumber;
    private String parcelVillage;
    private Long applicantId;
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private ServiceType serviceType;
    private String serviceDisplayName;
    private ApplicationStatus status;
    private Long departmentId;
    private String departmentName;
    private String departmentCode;
    private Long assignedOfficerId;
    private String assignedOfficerName;
    private String remarks;
    private String proposedLandUse;
    private Double buildingHeightM;
    private Double builtUpAreaSqM;
    private String waterConnectionType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder.Default
    private List<WorkflowHistoryDto> timeline = new ArrayList<>();

    public static ApplicationDto fromEntity(Application app) {
        List<WorkflowHistoryDto> timeline = app.getWorkflowHistories() != null ?
                app.getWorkflowHistories().stream()
                        .map(WorkflowHistoryDto::fromEntity)
                        .collect(Collectors.toList()) : new ArrayList<>();

        return ApplicationDto.builder()
                .id(app.getId())
                .applicationNumber(app.getApplicationNumber())
                .parcelId(app.getParcel().getId())
                .parcelUlpin(app.getParcel().getUlpin())
                .parcelSurveyNumber(app.getParcel().getSurveyNumber())
                .parcelVillage(app.getParcel().getVillage())
                .applicantId(app.getApplicant().getId())
                .applicantName(app.getApplicant().getFullName())
                .applicantEmail(app.getApplicant().getEmail())
                .applicantPhone(app.getApplicant().getPhone())
                .serviceType(app.getServiceType())
                .serviceDisplayName(app.getServiceType().getDisplayName())
                .status(app.getStatus())
                .departmentId(app.getDepartment().getId())
                .departmentName(app.getDepartment().getName())
                .departmentCode(app.getDepartment().getCode())
                .assignedOfficerId(app.getAssignedOfficer() != null ? app.getAssignedOfficer().getId() : null)
                .assignedOfficerName(app.getAssignedOfficer() != null ? app.getAssignedOfficer().getFullName() : "Unassigned")
                .remarks(app.getRemarks())
                .proposedLandUse(app.getProposedLandUse())
                .buildingHeightM(app.getBuildingHeightM())
                .builtUpAreaSqM(app.getBuiltUpAreaSqM())
                .waterConnectionType(app.getWaterConnectionType())
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .timeline(timeline)
                .build();
    }
}
