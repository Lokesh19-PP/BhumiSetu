package in.bhumisetu.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OcrResultDto {

    private Long documentId;
    private String fileName;
    private String fileUrl;
    private String ocrEngine; // "Tesseract-OCR" or "RuleBased-Fallback"
    private String rawText;
    private ExtractedMetadataDto extractedMetadata;
    private Long matchedParcelId;
    private String matchedParcelSurvey;
    private String matchedParcelVillage;
}
