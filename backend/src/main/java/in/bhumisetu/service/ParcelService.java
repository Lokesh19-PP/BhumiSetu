package in.bhumisetu.service;

import in.bhumisetu.domain.entity.LandParcel;
import in.bhumisetu.dto.parcel.GeoJsonFeatureCollection;
import in.bhumisetu.dto.parcel.ParcelDossierDto;
import in.bhumisetu.dto.parcel.ParcelSummaryDto;
import in.bhumisetu.exception.ResourceNotFoundException;
import in.bhumisetu.repository.LandParcelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParcelService {

    private final LandParcelRepository landParcelRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    @Transactional(readOnly = true)
    public List<ParcelSummaryDto> getAllParcels() {
        return landParcelRepository.findAll().stream()
                .map(ParcelSummaryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ParcelSummaryDto> searchParcels(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllParcels();
        }
        return landParcelRepository.searchByQuery(query.trim()).stream()
                .map(ParcelSummaryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ParcelSummaryDto getParcelById(Long id) {
        LandParcel parcel = landParcelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Land parcel not found with ID: " + id));
        return ParcelSummaryDto.fromEntity(parcel);
    }

    @Transactional(readOnly = true)
    public ParcelSummaryDto getParcelByUlpin(String ulpin) {
        LandParcel parcel = landParcelRepository.findByUlpin(ulpin.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Land parcel not found with ULPIN: " + ulpin));
        return ParcelSummaryDto.fromEntity(parcel);
    }

    @Transactional(readOnly = true)
    public ParcelSummaryDto getParcelBySurveyNumber(String surveyNumber) {
        LandParcel parcel = landParcelRepository.findBySurveyNumber(surveyNumber.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Land parcel not found with survey number: " + surveyNumber));
        return ParcelSummaryDto.fromEntity(parcel);
    }

    @Transactional(readOnly = true)
    public ParcelDossierDto getParcelDossier(Long id) {
        LandParcel parcel = landParcelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Land parcel not found with ID: " + id));
        return ParcelDossierDto.fromEntity(parcel);
    }

    @Transactional(readOnly = true)
    public ParcelDossierDto getParcelDossierByUlpin(String ulpin) {
        LandParcel parcel = landParcelRepository.findByUlpin(ulpin.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Land parcel not found with ULPIN: " + ulpin));
        return ParcelDossierDto.fromEntity(parcel);
    }

    @Transactional(readOnly = true)
    public GeoJsonFeatureCollection getParcelsAsGeoJson() {
        List<LandParcel> parcels = landParcelRepository.findAll();
        List<GeoJsonFeatureCollection.GeoJsonFeature> features = new ArrayList<>();

        for (LandParcel parcel : parcels) {
            Polygon poly = parcel.getBoundary();

            // Convert coordinates to GeoJSON [[[lon, lat], ...]]
            List<List<Double>> ring = new ArrayList<>();
            for (Coordinate c : poly.getExteriorRing().getCoordinates()) {
                ring.add(List.of(c.getX(), c.getY())); // lon, lat
            }
            List<List<List<Double>>> coords = List.of(ring);

            GeoJsonFeatureCollection.GeoJsonGeometry geom = GeoJsonFeatureCollection.GeoJsonGeometry.builder()
                    .type("Polygon")
                    .coordinates(coords)
                    .build();

            Point centroid = poly.getCentroid();
            String ownerName = parcel.getOwnershipRecords().isEmpty() ? "Not Recorded"
                    : parcel.getOwnershipRecords().get(0).getOwnerName();

            Map<String, Object> props = new HashMap<>();
            props.put("id", parcel.getId());
            props.put("ulpin", parcel.getUlpin());
            props.put("surveyNumber", parcel.getSurveyNumber());
            props.put("village", parcel.getVillage());
            props.put("taluka", parcel.getTaluka());
            props.put("district", parcel.getDistrict());
            props.put("areaSqM", parcel.getAreaSqM());
            props.put("landUse", parcel.getLandUse().name());
            props.put("primaryOwner", ownerName);
            props.put("centroidLat", centroid.getY());
            props.put("centroidLon", centroid.getX());
            props.put("documentCount", parcel.getDocuments() != null ? parcel.getDocuments().size() : 0);
            props.put("applicationCount", parcel.getApplications() != null ? parcel.getApplications().size() : 0);

            features.add(GeoJsonFeatureCollection.GeoJsonFeature.builder()
                    .type("Feature")
                    .id(parcel.getId())
                    .geometry(geom)
                    .properties(props)
                    .build());
        }

        return GeoJsonFeatureCollection.builder()
                .type("FeatureCollection")
                .features(features)
                .build();
    }

    @Transactional(readOnly = true)
    public List<ParcelSummaryDto> findWithinBoundingBox(Double minLon, Double minLat, Double maxLon, Double maxLat) {
        Coordinate[] bboxCoords = new Coordinate[] {
                new Coordinate(minLon, minLat),
                new Coordinate(maxLon, minLat),
                new Coordinate(maxLon, maxLat),
                new Coordinate(minLon, maxLat),
                new Coordinate(minLon, minLat)
        };
        Polygon bbox = geometryFactory.createPolygon(bboxCoords);
        bbox.setSRID(4326);

        return landParcelRepository.findWithinBoundingBox(bbox).stream()
                .map(ParcelSummaryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ParcelSummaryDto findByPoint(Double lat, Double lon) {
        Point point = geometryFactory.createPoint(new Coordinate(lon, lat));
        point.setSRID(4326);

        List<LandParcel> matches = landParcelRepository.findByPoint(point);
        if (matches.isEmpty()) {
            throw new ResourceNotFoundException("No parcel found at coordinate lat=" + lat + ", lon=" + lon);
        }
        return ParcelSummaryDto.fromEntity(matches.get(0));
    }
}
