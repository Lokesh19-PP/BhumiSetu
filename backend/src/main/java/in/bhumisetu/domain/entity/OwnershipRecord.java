package in.bhumisetu.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ownership_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OwnershipRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parcel_id", nullable = false)
    private LandParcel parcel;

    @Column(name = "owner_name", nullable = false, length = 150)
    private String ownerName;

    @Column(name = "aadhaar_masked", length = 20)
    private String aadhaarMasked; // e.g., "XXXX-XXXX-4819"

    @Column(name = "ownership_share", length = 30)
    private String ownershipShare; // e.g., "100%", "50%", "33.33%"

    @Column(name = "ownership_type", length = 50)
    private String ownershipType; // e.g., "INDIVIDUAL", "JOINT", "ANCESTRAL"

    @Column(name = "acquired_date")
    private LocalDate acquiredDate;

    @Column(name = "mutation_number", length = 50)
    private String mutationNumber; // e.g., "MUT-2021-9871"

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
