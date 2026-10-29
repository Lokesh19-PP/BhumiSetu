package in.bhumisetu.dto.parcel;

import in.bhumisetu.domain.entity.WorkflowHistory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkflowHistoryDto {
    private Long id;
    private Long applicationId;
    private String action;
    private String actedByName;
    private String actedByRole;
    private String comment;
    private LocalDateTime timestamp;

    public static WorkflowHistoryDto fromEntity(WorkflowHistory history) {
        return WorkflowHistoryDto.builder()
                .id(history.getId())
                .applicationId(history.getApplication().getId())
                .action(history.getAction())
                .actedByName(history.getActedBy() != null ? history.getActedBy().getFullName() : "System")
                .actedByRole(history.getActedBy() != null ? history.getActedBy().getRole().name() : "SYSTEM")
                .comment(history.getComment())
                .timestamp(history.getTimestamp())
                .build();
    }
}
