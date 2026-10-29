package in.bhumisetu.dto.search;

import in.bhumisetu.domain.enums.DocumentType;
import in.bhumisetu.dto.ai.ExtractedMetadataDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentSearchResultDto {

    private Long id;
    private Long parcelId;
    private String surveyNumber;
    private String ulpin;
    private String village;
    private String taluka;
    private String district;
    private DocumentType documentType;
    private String documentTypeTitle;
    private String fileName;
    private String filePath;
    private Long fileSizeBytes;
    private Boolean verified;
    private LocalDateTime uploadedAt;

    private String matchSnippet;
    private List<String> matchedFields;
    private ExtractedMetadataDto extractedMetadata;
    private Double matchScore;
}
