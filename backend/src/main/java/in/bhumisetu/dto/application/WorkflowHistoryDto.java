package in.bhumisetu.dto.application;

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
    private String action;
    private Long actedById;
    private String actedByName;
    private String actedByRole;
    private String comment;
    private LocalDateTime timestamp;

    public static WorkflowHistoryDto fromEntity(WorkflowHistory history) {
        if (history == null) return null;
        return WorkflowHistoryDto.builder()
                .id(history.getId())
                .action(history.getAction())
                .actedById(history.getActedBy() != null ? history.getActedBy().getId() : null)
                .actedByName(history.getActedBy() != null ? history.getActedBy().getFullName() : "System")
                .actedByRole(history.getActedBy() != null ? history.getActedBy().getRole().name() : "SYSTEM")
                .comment(history.getComment())
                .timestamp(history.getTimestamp())
                .build();
    }
}
