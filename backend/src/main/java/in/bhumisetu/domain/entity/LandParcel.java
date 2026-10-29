package in.bhumisetu.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import in.bhumisetu.domain.enums.LandUseType;
import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Polygon;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "land_parcels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LandParcel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 14-character Unique Land Parcel Identification Number (ULPIN)
    @Column(nullable = false, unique = true, length = 20)
    private String ulpin;

    // Survey number / Gat number (e.g., "125/2", "48/1A")
    @Column(nullable = false, length = 50)
    private String surveyNumber;

    @Column(nullable = false, length = 100)
    private String village;

    @Column(nullable = false, length = 100)
    private String taluka;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(name = "area_sq_m", nullable = false)
    private Double areaSqM;

    @Enumerated(EnumType.STRING)
    @Column(name = "land_use", nullable = false, length = 50)
    private LandUseType landUse;

    // Spatial Polygon geometry in WGS84 (SRID 4326)
    @Column(columnDefinition = "geometry(Polygon, 4326)", nullable = false)
    private Polygon boundary;

    @OneToMany(mappedBy = "parcel", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<OwnershipRecord> ownershipRecords = new ArrayList<>();

    @OneToMany(mappedBy = "parcel", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<Document> documents = new ArrayList<>();

    @OneToMany(mappedBy = "parcel", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<Application> applications = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
