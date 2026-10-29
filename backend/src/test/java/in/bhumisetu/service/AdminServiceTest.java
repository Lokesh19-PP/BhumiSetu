package in.bhumisetu.service;

import in.bhumisetu.domain.entity.Department;
import in.bhumisetu.domain.entity.User;
import in.bhumisetu.domain.enums.ApplicationStatus;
import in.bhumisetu.domain.enums.Role;
import in.bhumisetu.domain.enums.ServiceType;
import in.bhumisetu.dto.admin.AdminUserDto;
import in.bhumisetu.dto.admin.AnalyticsDto;
import in.bhumisetu.repository.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private LandParcelRepository landParcelRepository;
    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private DocumentRepository documentRepository;
    @Mock
    private DepartmentRepository departmentRepository;
    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private AdminService adminService;

    @Test
    @DisplayName("Should aggregate analytics counts and return chart distributions")
    void testGetAnalytics() {
        when(landParcelRepository.count()).thenReturn(25L);
        when(applicationRepository.count()).thenReturn(15L);
        when(userRepository.count()).thenReturn(6L);
        when(documentRepository.count()).thenReturn(30L);

        when(applicationRepository.countByServiceType(ServiceType.BUILDING_PERMISSION)).thenReturn(8L);
        when(applicationRepository.countByServiceType(ServiceType.LAND_USE_CHANGE)).thenReturn(4L);
        when(applicationRepository.countByServiceType(ServiceType.WATER_CONNECTION)).thenReturn(3L);

        when(applicationRepository.countByStatus(ApplicationStatus.APPROVED)).thenReturn(7L);
        when(applicationRepository.countByStatus(ApplicationStatus.SUBMITTED)).thenReturn(3L);
        when(applicationRepository.countByStatus(ApplicationStatus.UNDER_REVIEW)).thenReturn(3L);
        when(applicationRepository.countByStatus(ApplicationStatus.INFO_REQUESTED)).thenReturn(1L);
        when(applicationRepository.countByStatus(ApplicationStatus.REJECTED)).thenReturn(1L);

        Department dept = Department.builder().id(1L).code("PLANNING").name("Town Planning").build();
        when(departmentRepository.findAll()).thenReturn(List.of(dept));
        when(applicationRepository.findAll()).thenReturn(List.of());

        AnalyticsDto analytics = adminService.getAnalytics();

        assertNotNull(analytics);
        assertEquals(25L, analytics.getTotalParcels());
        assertEquals(15L, analytics.getTotalApplications());
        assertEquals(6L, analytics.getTotalUsers());
        assertEquals(30L, analytics.getTotalDocuments());
        assertEquals(3, analytics.getApplicationsByService().size());
        assertEquals(5, analytics.getApplicationsByStatus().size());
    }

    @Test
    @DisplayName("Should retrieve registered user directory")
    void testGetUsers() {
        User admin = User.builder().id(1L).fullName("System Admin").email("admin@bhumisetu.in").role(Role.ADMIN).build();
        User citizen = User.builder().id(2L).fullName("Ramesh Patil").email("citizen@bhumisetu.in").role(Role.CITIZEN).build();

        when(userRepository.findAll()).thenReturn(List.of(admin, citizen));

        List<AdminUserDto> users = adminService.getUsers();

        assertNotNull(users);
        assertEquals(2, users.size());
        assertEquals("admin@bhumisetu.in", users.get(0).getEmail());
        assertEquals(Role.ADMIN, users.get(0).getRole());
    }
}
