package in.bhumisetu.dto.admin;

import in.bhumisetu.domain.entity.AuditLog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAuditLogDto {

    private Long id;
    private Long userId;
    private String userEmail;
    private String action;
    private String entity;
    private String entityId;
    private String ipAddress;
    private String details;
    private LocalDateTime timestamp;

    public static AdminAuditLogDto fromEntity(AuditLog log) {
        if (log == null) return null;
        return AdminAuditLogDto.builder()
                .id(log.getId())
                .userId(log.getUserId())
                .userEmail(log.getUserEmail())
                .action(log.getAction())
                .entity(log.getEntity())
                .entityId(log.getEntityId())
                .ipAddress(log.getIpAddress())
                .details(log.getDetails())
                .timestamp(log.getTimestamp())
                .build();
    }
}
