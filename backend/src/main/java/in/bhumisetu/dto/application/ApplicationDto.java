package in.bhumisetu.dto.application;

import in.bhumisetu.domain.entity.Application;
import in.bhumisetu.domain.enums.ApplicationStatus;
import in.bhumisetu.domain.enums.ServiceType;
import in.bhumisetu.dto.parcel.DocumentDto;
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

    // Parcel Info
    private Long parcelId;
    private String surveyNumber;
    private String ulpin;
    private String village;
    private String taluka;
    private String district;
    private Double areaSqM;
    private String currentLandUse;

    // Applicant Info
    private Long applicantId;
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;

    // Service & Status
    private ServiceType serviceType;
    private String serviceTypeTitle;
    private ApplicationStatus status;
    private String statusTitle;

    // Routing Department
    private Long departmentId;
    private String departmentCode;
    private String departmentName;

    // Assigned Officer
    private Long assignedOfficerId;
    private String assignedOfficerName;

    // Service specific fields
    private String remarks;
    private String proposedLandUse;
    private Double buildingHeightM;
    private Double builtUpAreaSqM;
    private String waterConnectionType;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder.Default
    private List<WorkflowHistoryDto> workflowHistory = new ArrayList<>();

    @Builder.Default
    private List<DocumentDto> documents = new ArrayList<>();

    public static ApplicationDto fromEntity(Application app) {
        if (app == null) return null;

        return ApplicationDto.builder()
                .id(app.getId())
                .applicationNumber(app.getApplicationNumber())
                .parcelId(app.getParcel() != null ? app.getParcel().getId() : null)
                .surveyNumber(app.getParcel() != null ? app.getParcel().getSurveyNumber() : null)
                .ulpin(app.getParcel() != null ? app.getParcel().getUlpin() : null)
                .village(app.getParcel() != null ? app.getParcel().getVillage() : null)
                .taluka(app.getParcel() != null ? app.getParcel().getTaluka() : null)
                .district(app.getParcel() != null ? app.getParcel().getDistrict() : null)
                .areaSqM(app.getParcel() != null ? app.getParcel().getAreaSqM() : null)
                .currentLandUse(app.getParcel() != null && app.getParcel().getLandUse() != null
                        ? app.getParcel().getLandUse().name() : null)
                .applicantId(app.getApplicant() != null ? app.getApplicant().getId() : null)
                .applicantName(app.getApplicant() != null ? app.getApplicant().getFullName() : null)
                .applicantEmail(app.getApplicant() != null ? app.getApplicant().getEmail() : null)
                .applicantPhone(app.getApplicant() != null ? app.getApplicant().getPhone() : null)
                .serviceType(app.getServiceType())
                .serviceTypeTitle(app.getServiceType() != null ? app.getServiceType().getDisplayName() : null)
                .status(app.getStatus())
                .statusTitle(app.getStatus() != null ? app.getStatus().name() : null)
                .departmentId(app.getDepartment() != null ? app.getDepartment().getId() : null)
                .departmentCode(app.getDepartment() != null ? app.getDepartment().getCode() : null)
                .departmentName(app.getDepartment() != null ? app.getDepartment().getName() : null)
                .assignedOfficerId(app.getAssignedOfficer() != null ? app.getAssignedOfficer().getId() : null)
                .assignedOfficerName(app.getAssignedOfficer() != null ? app.getAssignedOfficer().getFullName() : null)
                .remarks(app.getRemarks())
                .proposedLandUse(app.getProposedLandUse())
                .buildingHeightM(app.getBuildingHeightM())
                .builtUpAreaSqM(app.getBuiltUpAreaSqM())
                .waterConnectionType(app.getWaterConnectionType())
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .workflowHistory(app.getWorkflowHistories() != null
                        ? app.getWorkflowHistories().stream()
                                .map(WorkflowHistoryDto::fromEntity)
                                .collect(Collectors.toList())
                        : new ArrayList<>())
                .build();
    }
}
