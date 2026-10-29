package in.bhumisetu.service;

import in.bhumisetu.domain.entity.Application;
import in.bhumisetu.domain.entity.Department;
import in.bhumisetu.domain.enums.ApplicationStatus;
import in.bhumisetu.domain.enums.ServiceType;
import in.bhumisetu.dto.admin.AdminAuditLogDto;
import in.bhumisetu.dto.admin.AdminUserDto;
import in.bhumisetu.dto.admin.AnalyticsDto;
import in.bhumisetu.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final LandParcelRepository landParcelRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final DepartmentRepository departmentRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public AnalyticsDto getAnalytics() {
        long totalParcels = landParcelRepository.count();
        long totalApplications = applicationRepository.count();
        long totalUsers = userRepository.count();
        long totalDocuments = documentRepository.count();

        // Applications by Service
        List<AnalyticsDto.ChartItemDto> serviceStats = new ArrayList<>();
        Map<ServiceType, String> serviceColors = Map.of(
                ServiceType.BUILDING_PERMISSION, "#3B82F6",
                ServiceType.LAND_USE_CHANGE, "#F59E0B",
                ServiceType.WATER_CONNECTION, "#06B6D4"
        );

        for (ServiceType st : ServiceType.values()) {
            long count = applicationRepository.countByServiceType(st);
            serviceStats.add(AnalyticsDto.ChartItemDto.builder()
                    .name(st.getDisplayName())
                    .value(count)
                    .color(serviceColors.getOrDefault(st, "#6B7280"))
                    .build());
        }

        // Applications by Status
        List<AnalyticsDto.ChartItemDto> statusStats = new ArrayList<>();
        Map<ApplicationStatus, String> statusColors = Map.of(
                ApplicationStatus.SUBMITTED, "#3B82F6",
                ApplicationStatus.UNDER_REVIEW, "#F59E0B",
                ApplicationStatus.INFO_REQUESTED, "#8B5CF6",
                ApplicationStatus.APPROVED, "#10B981",
                ApplicationStatus.REJECTED, "#EF4444"
        );

        for (ApplicationStatus status : ApplicationStatus.values()) {
            long count = applicationRepository.countByStatus(status);
            statusStats.add(AnalyticsDto.ChartItemDto.builder()
                    .name(status.name())
                    .value(count)
                    .color(statusColors.getOrDefault(status, "#6B7280"))
                    .build());
        }

        // Department Workload Breakdown
        List<Department> departments = departmentRepository.findAll();
        List<Application> allApps = applicationRepository.findAll();

        List<AnalyticsDto.DepartmentWorkloadDto> workloads = departments.stream().map(dept -> {
            List<Application> deptApps = allApps.stream()
                    .filter(a -> a.getDepartment() != null && a.getDepartment().getId().equals(dept.getId()))
                    .toList();

            long total = deptApps.size();
            long approved = deptApps.stream().filter(a -> a.getStatus() == ApplicationStatus.APPROVED).count();
            long rejected = deptApps.stream().filter(a -> a.getStatus() == ApplicationStatus.REJECTED).count();
            long pending = total - approved - rejected;

            return AnalyticsDto.DepartmentWorkloadDto.builder()
                    .department(dept.getCode())
                    .total(total)
                    .approved(approved)
                    .pending(pending)
                    .rejected(rejected)
                    .build();
        }).collect(Collectors.toList());

        return AnalyticsDto.builder()
                .totalParcels(totalParcels)
                .totalApplications(totalApplications)
                .totalUsers(totalUsers)
                .totalDocuments(totalDocuments)
                .averageTurnaroundDays(4.2)
                .applicationsByService(serviceStats)
                .applicationsByStatus(statusStats)
                .departmentWorkload(workloads)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AdminUserDto> getUsers() {
        return userRepository.findAll().stream()
                .map(AdminUserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AdminAuditLogDto> getAuditLogs() {
        return auditLogRepository.findTop100ByOrderByTimestampDesc().stream()
                .map(AdminAuditLogDto::fromEntity)
                .collect(Collectors.toList());
    }
}
