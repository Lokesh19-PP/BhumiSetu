package in.bhumisetu.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_email", length = 120)
    private String userEmail;

    @Column(nullable = false, length = 100)
    private String action; // e.g. "LOGIN", "REGISTER", "VIEW_PARCEL", "UPLOAD_DOC", "SUBMIT_APPLICATION", "OFFICER_DECISION"

    @Column(length = 100)
    private String entity; // e.g. "LandParcel", "Document", "Application", "User"

    @Column(name = "entity_id")
    private String entityId;

    @Column(name = "ip_address", length = 60)
    private String ipAddress;

    @Column(length = 2000)
    private String details;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }
}
