package in.bhumisetu.controller;

import in.bhumisetu.dto.parcel.GeoJsonFeatureCollection;
import in.bhumisetu.dto.parcel.ParcelDossierDto;
import in.bhumisetu.dto.parcel.ParcelSummaryDto;
import in.bhumisetu.service.ParcelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parcels")
@RequiredArgsConstructor
@Tag(name = "GIS & Land Parcel Management", description = "Endpoints for parcel search, spatial GIS queries, GeoJSON layers, and complete dossiers")
public class ParcelController {

    private final ParcelService parcelService;

    @GetMapping
    @Operation(summary = "Search or list land parcels", description = "Find parcels by query (matches Survey Number, ULPIN, Village) or returns all parcels if query is empty")
    public ResponseEntity<List<ParcelSummaryDto>> getParcels(
            @Parameter(description = "Search query string (survey number, ULPIN, or village)")
            @RequestParam(required = false) String q) {
        if (q != null && !q.trim().isEmpty()) {
            return ResponseEntity.ok(parcelService.searchParcels(q));
        }
        return ResponseEntity.ok(parcelService.getAllParcels());
    }

    @GetMapping("/geojson")
    @Operation(summary = "Get parcels as GeoJSON FeatureCollection", description = "Produces standard GeoJSON FeatureCollection formatted for Leaflet polygon layer visualization")
    public ResponseEntity<GeoJsonFeatureCollection> getParcelsGeoJson() {
        return ResponseEntity.ok(parcelService.getParcelsAsGeoJson());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get land parcel by ID", description = "Returns high-level summary of a specific land parcel")
    public ResponseEntity<ParcelSummaryDto> getParcelById(@PathVariable Long id) {
        return ResponseEntity.ok(parcelService.getParcelById(id));
    }

    @GetMapping("/by-ulpin/{ulpin}")
    @Operation(summary = "Find parcel by 14-char ULPIN", description = "Direct lookup using Unique Land Parcel Identification Number")
    public ResponseEntity<ParcelSummaryDto> getParcelByUlpin(@PathVariable String ulpin) {
        return ResponseEntity.ok(parcelService.getParcelByUlpin(ulpin));
    }

    @GetMapping("/by-survey/{surveyNumber}")
    @Operation(summary = "Find parcel by Survey/Gat Number", description = "Direct lookup by village survey number")
    public ResponseEntity<ParcelSummaryDto> getParcelBySurveyNumber(@PathVariable String surveyNumber) {
        return ResponseEntity.ok(parcelService.getParcelBySurveyNumber(surveyNumber));
    }

    @GetMapping("/{id}/dossier")
    @Operation(summary = "Get comprehensive Parcel Dossier by ID", description = "Returns complete parcel dossier containing ownership records, verified documents, applications, and unified history")
    public ResponseEntity<ParcelDossierDto> getParcelDossier(@PathVariable Long id) {
        return ResponseEntity.ok(parcelService.getParcelDossier(id));
    }

    @GetMapping("/by-ulpin/{ulpin}/dossier")
    @Operation(summary = "Get comprehensive Parcel Dossier by ULPIN", description = "Returns complete parcel dossier queried by ULPIN")
    public ResponseEntity<ParcelDossierDto> getParcelDossierByUlpin(@PathVariable String ulpin) {
        return ResponseEntity.ok(parcelService.getParcelDossierByUlpin(ulpin));
    }

    @GetMapping("/spatial/bbox")
    @Operation(summary = "Spatial bounding box query", description = "Finds parcels intersecting a GPS bounding box")
    public ResponseEntity<List<ParcelSummaryDto>> getParcelsInBBox(
            @RequestParam Double minLon,
            @RequestParam Double minLat,
            @RequestParam Double maxLon,
            @RequestParam Double maxLat) {
        return ResponseEntity.ok(parcelService.findWithinBoundingBox(minLon, minLat, maxLon, maxLat));
    }

    @GetMapping("/spatial/point")
    @Operation(summary = "Spatial point-in-polygon query", description = "Identifies which parcel polygon contains the clicked map GPS point")
    public ResponseEntity<ParcelSummaryDto> getParcelAtPoint(
            @RequestParam Double lat,
            @RequestParam Double lon) {
        return ResponseEntity.ok(parcelService.findByPoint(lat, lon));
    }
}
