package in.bhumisetu.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsDto {

    private long totalParcels;
    private long totalApplications;
    private long totalUsers;
    private long totalDocuments;
    private double averageTurnaroundDays;

    private List<ChartItemDto> applicationsByService;
    private List<ChartItemDto> applicationsByStatus;
    private List<DepartmentWorkloadDto> departmentWorkload;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChartItemDto {
        private String name;
        private Long value;
        private String color;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DepartmentWorkloadDto {
        private String department;
        private long total;
        private long approved;
        private long pending;
        private long rejected;
    }
}
