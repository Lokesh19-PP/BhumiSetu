package in.bhumisetu.parcel;

import in.bhumisetu.domain.entity.LandParcel;
import in.bhumisetu.domain.enums.LandUseType;
import in.bhumisetu.dto.parcel.GeoJsonFeatureCollection;
import in.bhumisetu.dto.parcel.ParcelDossierDto;
import in.bhumisetu.dto.parcel.ParcelSummaryDto;
import in.bhumisetu.repository.LandParcelRepository;
import in.bhumisetu.service.ParcelService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.geom.PrecisionModel;
import org.locationtech.jts.io.WKTReader;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ParcelServiceTest {

    @Mock
    private LandParcelRepository landParcelRepository;

    @InjectMocks
    private ParcelService parcelService;

    private LandParcel sampleParcel;

    @BeforeEach
    void setUp() throws Exception {
        GeometryFactory gf = new GeometryFactory(new PrecisionModel(), 4326);
        WKTReader reader = new WKTReader(gf);
        Polygon polygon = (Polygon) reader.read("POLYGON((73.7250 18.5910, 73.7275 18.5910, 73.7275 18.5890, 73.7250 18.5890, 73.7250 18.5910))");
        polygon.setSRID(4326);

        sampleParcel = LandParcel.builder()
                .id(1L)
                .ulpin("MH-PUN-HIN-001")
                .surveyNumber("125/2")
                .village("Hinjewadi")
                .taluka("Mulshi")
                .district("Pune")
                .areaSqM(3450.0)
                .landUse(LandUseType.COMMERCIAL)
                .boundary(polygon)
                .ownershipRecords(new ArrayList<>())
                .documents(new ArrayList<>())
                .applications(new ArrayList<>())
                .build();
    }

    @Test
    void testSearchParcels() {
        when(landParcelRepository.searchByQuery("125")).thenReturn(List.of(sampleParcel));

        List<ParcelSummaryDto> results = parcelService.searchParcels("125");

        assertEquals(1, results.size());
        assertEquals("125/2", results.get(0).getSurveyNumber());
        assertEquals("MH-PUN-HIN-001", results.get(0).getUlpin());
    }

    @Test
    void testGetParcelsAsGeoJson() {
        when(landParcelRepository.findAll()).thenReturn(List.of(sampleParcel));

        GeoJsonFeatureCollection geoJson = parcelService.getParcelsAsGeoJson();

        assertNotNull(geoJson);
        assertEquals("FeatureCollection", geoJson.getType());
        assertEquals(1, geoJson.getFeatures().size());
        assertEquals(1L, geoJson.getFeatures().get(0).getId());
        assertEquals("Polygon", geoJson.getFeatures().get(0).getGeometry().getType());
    }

    @Test
    void testGetParcelDossier() {
        when(landParcelRepository.findById(1L)).thenReturn(Optional.of(sampleParcel));

        ParcelDossierDto dossier = parcelService.getParcelDossier(1L);

        assertNotNull(dossier);
        assertEquals("125/2", dossier.getSurveyNumber());
        assertEquals("Hinjewadi", dossier.getVillage());
        assertFalse(dossier.getBoundaryCoordinates().isEmpty());
    }
}
