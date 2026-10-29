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
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParcelSummaryDto {
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
    private String primaryOwner;
    private int documentCount;
    private int activeApplicationCount;
    private LocalDateTime createdAt;

    public static ParcelSummaryDto fromEntity(LandParcel parcel) {
        Point centroid = parcel.getBoundary().getCentroid();
        String primaryOwner = parcel.getOwnershipRecords().isEmpty() ? "Not Recorded"
                : parcel.getOwnershipRecords().get(0).getOwnerName();

        return ParcelSummaryDto.builder()
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
                .primaryOwner(primaryOwner)
                .documentCount(parcel.getDocuments() != null ? parcel.getDocuments().size() : 0)
                .activeApplicationCount(parcel.getApplications() != null ?
                        (int) parcel.getApplications().stream()
                                .filter(a -> a.getStatus().name().matches("SUBMITTED|UNDER_REVIEW|INFO_REQUESTED"))
                                .count() : 0)
                .createdAt(parcel.getCreatedAt())
                .build();
    }
}
