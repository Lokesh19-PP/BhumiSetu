package in.bhumisetu.service;

import in.bhumisetu.domain.entity.*;
import in.bhumisetu.domain.enums.ApplicationStatus;
import in.bhumisetu.domain.enums.Role;
import in.bhumisetu.domain.enums.ServiceType;
import in.bhumisetu.dto.application.ApplicationDto;
import in.bhumisetu.dto.application.CreateApplicationRequest;
import in.bhumisetu.dto.application.OfficerDecisionRequest;
import in.bhumisetu.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private LandParcelRepository landParcelRepository;
    @Mock
    private DepartmentRepository departmentRepository;
    @Mock
    private WorkflowHistoryRepository workflowHistoryRepository;
    @Mock
    private DocumentRepository documentRepository;
    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private ApplicationService applicationService;

    private User citizen;
    private User planningOfficer;
    private Department planningDept;
    private LandParcel parcel;

    @BeforeEach
    void setUp() {
        citizen = User.builder()
                .id(1L)
                .fullName("Ramesh Patil")
                .email("citizen@bhumisetu.in")
                .role(Role.CITIZEN)
                .build();

        planningOfficer = User.builder()
                .id(2L)
                .fullName("Anita Deshmukh")
                .email("planning@bhumisetu.in")
                .role(Role.PLANNING_OFFICER)
                .build();

        planningDept = Department.builder()
                .id(10L)
                .code("PLANNING")
                .name("Town Planning Department")
                .build();

        parcel = LandParcel.builder()
                .id(100L)
                .surveyNumber("125/2")
                .ulpin("MH-PUN-HIN-001")
                .village("Hinjewadi")
                .build();
    }

    @Test
    @DisplayName("Should create Building Permission application and auto-route to PLANNING department")
    void testCreateApplicationAutoRouting() {
        CreateApplicationRequest request = CreateApplicationRequest.builder()
                .parcelId(100L)
                .serviceType(ServiceType.BUILDING_PERMISSION)
                .remarks("Commercial office building G+4")
                .buildingHeightM(18.5)
                .builtUpAreaSqM(1500.0)
                .build();

        when(landParcelRepository.findById(100L)).thenReturn(Optional.of(parcel));
        when(departmentRepository.findByCode("PLANNING")).thenReturn(Optional.of(planningDept));
        when(applicationRepository.count()).thenReturn(5L);
        when(applicationRepository.save(any(Application.class))).thenAnswer(invocation -> {
            Application app = invocation.getArgument(0);
            app.setId(501L);
            return app;
        });

        ApplicationDto result = applicationService.createApplication(request, citizen);

        assertNotNull(result);
        assertEquals(501L, result.getId());
        assertEquals("PLANNING", result.getDepartmentCode());
        assertEquals(ApplicationStatus.SUBMITTED, result.getStatus());
        assertTrue(result.getApplicationNumber().contains("BP-"));
        verify(workflowHistoryRepository, times(1)).save(any(WorkflowHistory.class));
    }

    @Test
    @DisplayName("Should strictly forbid CITIZEN from taking officer decisions")
    void testCitizenForbiddenFromApproval() {
        OfficerDecisionRequest request = OfficerDecisionRequest.builder()
                .action("APPROVE")
                .comment("Self approval attempt")
                .build();

        assertThrows(AccessDeniedException.class, () ->
                applicationService.takeDecision(501L, request, citizen));
    }

    @Test
    @DisplayName("Should allow PLANNING_OFFICER to approve application and update workflow history")
    void testOfficerApproveApplication() {
        Application existingApp = Application.builder()
                .id(501L)
                .applicationNumber("BS-2026-BP-00105")
                .parcel(parcel)
                .applicant(citizen)
                .department(planningDept)
                .serviceType(ServiceType.BUILDING_PERMISSION)
                .status(ApplicationStatus.UNDER_REVIEW)
                .build();

        when(applicationRepository.findById(501L)).thenReturn(Optional.of(existingApp));
        when(applicationRepository.save(any(Application.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OfficerDecisionRequest request = OfficerDecisionRequest.builder()
                .action("APPROVE")
                .comment("Sanctioned in accordance with PMRDA Building Bye-laws 2024")
                .build();

        ApplicationDto result = applicationService.takeDecision(501L, request, planningOfficer);

        assertNotNull(result);
        assertEquals(ApplicationStatus.APPROVED, result.getStatus());
        assertEquals(2L, result.getAssignedOfficerId());
        verify(workflowHistoryRepository, times(1)).save(any(WorkflowHistory.class));
    }
}
