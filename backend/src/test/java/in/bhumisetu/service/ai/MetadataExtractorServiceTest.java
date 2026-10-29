package in.bhumisetu.service.ai;

import in.bhumisetu.domain.enums.DocumentType;
import in.bhumisetu.dto.ai.ExtractedMetadataDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MetadataExtractorServiceTest {

    private MetadataExtractorService extractorService;

    @BeforeEach
    void setUp() {
        extractorService = new MetadataExtractorService();
    }

    @Test
    @DisplayName("Should extract cadastral metadata from realistic 7/12 Satbara text")
    void testExtractFromSatbaraText() {
        String sampleText = """
                GOVERNMENT OF MAHARASHTRA
                REVENUE AND FOREST DEPARTMENT
                FORM VII-XII (VILLAGE FORM VII - RECORD OF RIGHTS)
                
                District: Pune
                Taluka: Mulshi
                Village: Hinjewadi
                ULPIN: MH-PUN-HIN-001
                Survey Number / Gat No: 125/2
                Total Area: 3450 Sq. Meters
                
                Occupant / Land Holder Names:
                1. Ramesh Narayan Patil (Khata No. 402)
                
                Registration Date: 15/03/2024
                Registration Number: MH-PUN-REG-89211
                Tenure: Occupant Class 1
                Assessment: Rs 14.50
                """;

        ExtractedMetadataDto metadata = extractorService.extract(sampleText);

        assertNotNull(metadata);
        assertEquals("7/12 Satbara Extract", metadata.getDocumentType());
        assertEquals("125/2", metadata.getSurveyNumber());
        assertEquals("MH-PUN-HIN-001", metadata.getUlpin());
        assertEquals("Hinjewadi", metadata.getVillage());
        assertEquals("Pune", metadata.getDistrict());
        assertNotNull(metadata.getAreaSqM());
        assertEquals(3450.0, metadata.getAreaSqM(), 0.01);
        assertEquals("MH-PUN-REG-89211", metadata.getRegistrationNumber());
        assertTrue(metadata.getConfidence() > 0.8, "Confidence should be high for clean sample text");
    }

    @Test
    @DisplayName("Should handle fallback defaults when text has minimal matches")
    void testExtractWithSparseText() {
        String sparseText = "Land record for Gat No 45/1 located in Baner area.";

        ExtractedMetadataDto metadata = extractorService.extract(sparseText);

        assertNotNull(metadata);
        assertEquals("45/1", metadata.getSurveyNumber());
        assertEquals("Baner", metadata.getVillage());
    }
}
