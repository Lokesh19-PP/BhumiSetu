package in.bhumisetu.dto.parcel;

import in.bhumisetu.domain.entity.LandParcel;
import in.bhumisetu.domain.enums.LandUseType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParcelDossierDto {
    private Long id;
    private String ulpin;
    private String surveyNumber;
    private String village;
    private String taluka;
    private String district;
    private Double areaSqM;
    private LandUseType landUse;
    private Double centroidLat;
    private Double centroidLon;
    private List<List<Double>> boundaryCoordinates;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder.Default
    private List<OwnershipRecordDto> ownershipRecords = new ArrayList<>();

    @Builder.Default
    private List<DocumentDto> documents = new ArrayList<>();

    @Builder.Default
    private List<ApplicationDto> applications = new ArrayList<>();

    @Builder.Default
    private List<WorkflowHistoryDto> unifiedHistory = new ArrayList<>();

    public static ParcelDossierDto fromEntity(LandParcel parcel) {
        Point centroid = parcel.getBoundary().getCentroid();

        List<List<Double>> coords = new ArrayList<>();
        for (Coordinate c : parcel.getBoundary().getCoordinates()) {
            coords.add(List.of(c.getY(), c.getX())); // [lat, lon] for Leaflet
        }

        List<OwnershipRecordDto> owners = parcel.getOwnershipRecords() != null ?
                parcel.getOwnershipRecords().stream()
                        .map(OwnershipRecordDto::fromEntity)
                        .collect(Collectors.toList()) : new ArrayList<>();

        List<DocumentDto> docs = parcel.getDocuments() != null ?
                parcel.getDocuments().stream()
                        .map(DocumentDto::fromEntity)
                        .collect(Collectors.toList()) : new ArrayList<>();

        List<ApplicationDto> apps = parcel.getApplications() != null ?
                parcel.getApplications().stream()
                        .map(ApplicationDto::fromEntity)
                        .collect(Collectors.toList()) : new ArrayList<>();

        List<WorkflowHistoryDto> unifiedHistory = new ArrayList<>();
        if (parcel.getApplications() != null) {
            for (var app : parcel.getApplications()) {
                if (app.getWorkflowHistories() != null) {
                    for (var h : app.getWorkflowHistories()) {
                        unifiedHistory.add(WorkflowHistoryDto.fromEntity(h));
                    }
                }
            }
        }
        unifiedHistory.sort((h1, h2) -> h2.getTimestamp().compareTo(h1.getTimestamp()));

        return ParcelDossierDto.builder()
                .id(parcel.getId())
                .ulpin(parcel.getUlpin())
                .surveyNumber(parcel.getSurveyNumber())
                .village(parcel.getVillage())
                .taluka(parcel.getTaluka())
                .district(parcel.getDistrict())
                .areaSqM(parcel.getAreaSqM())
                .landUse(parcel.getLandUse())
                .centroidLat(centroid.getY())
                .centroidLon(centroid.getX())
                .boundaryCoordinates(coords)
                .createdAt(parcel.getCreatedAt())
                .updatedAt(parcel.getUpdatedAt())
                .ownershipRecords(owners)
                .documents(docs)
                .applications(apps)
                .unifiedHistory(unifiedHistory)
                .build();
    }
}
