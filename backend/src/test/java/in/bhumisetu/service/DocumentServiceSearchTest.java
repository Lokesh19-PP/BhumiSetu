package in.bhumisetu.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import in.bhumisetu.domain.entity.Document;
import in.bhumisetu.domain.entity.LandParcel;
import in.bhumisetu.domain.enums.DocumentType;
import in.bhumisetu.dto.search.DocumentSearchResultDto;
import in.bhumisetu.repository.DocumentRepository;
import in.bhumisetu.repository.LandParcelRepository;
import in.bhumisetu.repository.UserRepository;
import in.bhumisetu.service.ai.MetadataExtractorService;
import in.bhumisetu.service.ai.OcrService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DocumentServiceSearchTest {

    @Mock
    private DocumentRepository documentRepository;
    @Mock
    private LandParcelRepository landParcelRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private OcrService ocrService;
    @Mock
    private MetadataExtractorService metadataExtractorService;
    @Mock
    private AuditLogService auditLogService;
    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private DocumentService documentService;

    private Document doc1;
    private Document doc2;

    @BeforeEach
    void setUp() {
        LandParcel parcel1 = LandParcel.builder()
                .id(1L)
                .surveyNumber("125/2")
                .ulpin("MH-PUN-HIN-001")
                .village("Hinjewadi")
                .taluka("Mulshi")
                .district("Pune")
                .build();

        doc1 = Document.builder()
                .id(101L)
                .parcel(parcel1)
                .documentType(DocumentType.EXTRACT_7_12)
                .fileName("7-12_Extract_125_2.pdf")
                .fullText("Form VII-XII record of rights for survey number 125/2 in Hinjewadi village holder Ramesh Patil")
                .verified(true)
                .build();

        LandParcel parcel2 = LandParcel.builder()
                .id(2L)
                .surveyNumber("45/1")
                .ulpin("MH-PUN-BAN-002")
                .village("Baner")
                .taluka("Haveli")
                .district("Pune")
                .build();

        doc2 = Document.builder()
                .id(102L)
                .parcel(parcel2)
                .documentType(DocumentType.SALE_DEED)
                .fileName("Registered_Sale_Deed_Baner.pdf")
                .fullText("Registered conveyance deed executed for parcel 45/1 in Baner area")
                .verified(false)
                .build();
    }

    @Test
    @DisplayName("Should find document by survey number and generate matching snippet")
    void testSearchBySurveyNumber() {
        when(documentRepository.findAll()).thenReturn(List.of(doc1, doc2));

        List<DocumentSearchResultDto> results = documentService.searchDocuments("125/2", null, null, null);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(101L, results.get(0).getId());
        assertEquals("125/2", results.get(0).getSurveyNumber());
        assertTrue(results.get(0).getMatchSnippet().toLowerCase().contains("125/2"));
    }

    @Test
    @DisplayName("Should filter documents by village and verified status")
    void testFilterByVillageAndVerified() {
        when(documentRepository.findAll()).thenReturn(List.of(doc1, doc2));

        List<DocumentSearchResultDto> results = documentService.searchDocuments("", null, "Hinjewadi", true);

        assertEquals(1, results.size());
        assertEquals("Hinjewadi", results.get(0).getVillage());
        assertTrue(results.get(0).getVerified());
    }
}
