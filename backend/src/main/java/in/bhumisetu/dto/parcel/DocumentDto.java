package in.bhumisetu.dto.parcel;

import in.bhumisetu.domain.entity.Document;
import in.bhumisetu.domain.enums.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDto {
    private Long id;
    private Long parcelId;
    private DocumentType documentType;
    private String documentTypeTitle;
    private String fileName;
    private String filePath;
    private Long fileSizeBytes;
    private String contentType;
    private String extractedMetadata;
    private boolean verified;
    private String verifiedByName;
    private LocalDateTime verifiedAt;
    private String fullText;
    private String uploadedByName;
    private LocalDateTime uploadedAt;

    public static DocumentDto fromEntity(Document doc) {
        return DocumentDto.builder()
                .id(doc.getId())
                .parcelId(doc.getParcel().getId())
                .documentType(doc.getDocumentType())
                .documentTypeTitle(doc.getDocumentType().getTitle())
                .fileName(doc.getFileName())
                .filePath(doc.getFilePath())
                .fileSizeBytes(doc.getFileSizeBytes())
                .contentType(doc.getContentType())
                .extractedMetadata(doc.getExtractedMetadata())
                .verified(doc.isVerified())
                .verifiedByName(doc.getVerifiedBy() != null ? doc.getVerifiedBy().getFullName() : null)
                .verifiedAt(doc.getVerifiedAt())
                .fullText(doc.getFullText())
                .uploadedByName(doc.getUploadedBy() != null ? doc.getUploadedBy().getFullName() : null)
                .uploadedAt(doc.getUploadedAt())
                .build();
    }
}
