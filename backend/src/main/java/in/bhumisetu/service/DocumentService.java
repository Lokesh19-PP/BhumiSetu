package in.bhumisetu.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import in.bhumisetu.domain.entity.Document;
import in.bhumisetu.domain.entity.LandParcel;
import in.bhumisetu.domain.entity.User;
import in.bhumisetu.domain.enums.DocumentType;
import in.bhumisetu.dto.ai.ExtractedMetadataDto;
import in.bhumisetu.dto.ai.OcrResultDto;
import in.bhumisetu.dto.ai.VerifyDocumentRequest;
import in.bhumisetu.dto.parcel.DocumentDto;
import in.bhumisetu.exception.BadRequestException;
import in.bhumisetu.exception.ResourceNotFoundException;
import in.bhumisetu.repository.DocumentRepository;
import in.bhumisetu.repository.LandParcelRepository;
import in.bhumisetu.repository.UserRepository;
import in.bhumisetu.service.ai.MetadataExtractorService;
import in.bhumisetu.service.ai.OcrService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final LandParcelRepository landParcelRepository;
    private final UserRepository userRepository;
    private final OcrService ocrService;
    private final MetadataExtractorService metadataExtractorService;
    private final ObjectMapper objectMapper;
    private final AuditLogService auditLogService;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @Transactional
    public OcrResultDto uploadAndOcr(MultipartFile file, Long parcelId, User currentUser) {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file is empty");
        }

        try {
            // Ensure upload dir exists
            File uploadFolder = new File(uploadDir);
            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }

            // Save file
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".pdf";
            String savedFilename = UUID.randomUUID().toString() + "_" + originalFilename;
            Path filePath = Paths.get(uploadDir, savedFilename);

            try (InputStream is = file.getInputStream();
                 OutputStream os = Files.newOutputStream(filePath)) {
                is.transferTo(os);
            }

            File diskFile = filePath.toFile();

            // Run OCR
            OcrService.OcrExtraction ocr = ocrService.extractText(diskFile);

            // Extract Metadata with Confidence
            ExtractedMetadataDto metadata = metadataExtractorService.extract(ocr.rawText());

            // Auto-match parcel by ULPIN or Survey Number
            LandParcel matchedParcel = null;
            if (parcelId != null) {
                matchedParcel = landParcelRepository.findById(parcelId).orElse(null);
            }
            if (matchedParcel == null && metadata.getUlpin() != null) {
                matchedParcel = landParcelRepository.findByUlpin(metadata.getUlpin()).orElse(null);
            }
            if (matchedParcel == null && metadata.getSurveyNumber() != null) {
                matchedParcel = landParcelRepository.findBySurveyNumber(metadata.getSurveyNumber()).orElse(null);
            }
            // Fallback to Hinjewadi 125/2 if no match found
            if (matchedParcel == null) {
                matchedParcel = landParcelRepository.findBySurveyNumber("125/2")
                        .orElse(landParcelRepository.findAll().get(0));
            }

            // Determine document type enum
            DocumentType docType = DocumentType.EXTRACT_7_12;
            if (metadata.getDocumentType().contains("Sale Deed")) docType = DocumentType.SALE_DEED;
            else if (metadata.getDocumentType().contains("Building")) docType = DocumentType.BUILDING_PLAN;
            else if (metadata.getDocumentType().contains("Tax")) docType = DocumentType.TAX_RECEIPT;

            // Save unverified Document entity awaiting Review & Verify confirmation
            Document doc = Document.builder()
                    .parcel(matchedParcel)
                    .uploadedBy(currentUser)
                    .documentType(docType)
                    .fileName(originalFilename)
                    .filePath("/uploads/" + savedFilename)
                    .fileSizeBytes(file.getSize())
                    .contentType(file.getContentType())
                    .extractedMetadata(objectMapper.writeValueAsString(metadata))
                    .fullText(ocr.rawText())
                    .verified(false)
                    .build();

            Document savedDoc = documentRepository.save(doc);

            auditLogService.logAction(
                    currentUser.getId(),
                    currentUser.getEmail(),
                    "DOCUMENT_OCR_DIGITIZED",
                    "Document",
                    String.valueOf(savedDoc.getId()),
                    "127.0.0.1",
                    "OCR Engine: " + ocr.engine() + " | Confidence: " + metadata.getConfidence()
            );

            return OcrResultDto.builder()
                    .documentId(savedDoc.getId())
                    .fileName(savedDoc.getFileName())
                    .fileUrl("/uploads/" + savedFilename)
                    .ocrEngine(ocr.engine())
                    .rawText(ocr.rawText())
                    .extractedMetadata(metadata)
                    .matchedParcelId(matchedParcel.getId())
                    .matchedParcelSurvey(matchedParcel.getSurveyNumber())
                    .matchedParcelVillage(matchedParcel.getVillage())
                    .build();

        } catch (Exception e) {
            log.error("Failed to process document upload and OCR: {}", e.getMessage(), e);
            throw new RuntimeException("Document processing error: " + e.getMessage());
        }
    }

    @Transactional
    public DocumentDto verifyDocument(Long documentId, VerifyDocumentRequest request, User verifier) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + documentId));

        if (request.getParcelId() != null) {
            LandParcel parcel = landParcelRepository.findById(request.getParcelId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parcel not found with ID: " + request.getParcelId()));
            document.setParcel(parcel);
        }

        if (request.getDocumentType() != null) {
            document.setDocumentType(request.getDocumentType());
        }

        // Build verified metadata JSON
        try {
            ExtractedMetadataDto meta = ExtractedMetadataDto.builder()
                    .documentType(document.getDocumentType().getTitle())
                    .surveyNumber(request.getSurveyNumber())
                    .ulpin(request.getUlpin())
                    .village(request.getVillage())
                    .areaSqM(request.getAreaSqM())
                    .documentDate(request.getDocumentDate())
                    .registrationNumber(request.getRegistrationNumber())
                    .ownerNames(request.getOwnerNames())
                    .confidence(1.0) // Confirmed by user/officer
                    .build();

            document.setExtractedMetadata(objectMapper.writeValueAsString(meta));
        } catch (Exception e) {
            log.warn("Error updating verified metadata: {}", e.getMessage());
        }

        document.setVerified(true);
        document.setVerifiedBy(verifier);
        document.setVerifiedAt(LocalDateTime.now());

        Document saved = documentRepository.save(document);

        auditLogService.logAction(
                verifier.getId(),
                verifier.getEmail(),
                "DOCUMENT_VERIFIED",
                "Document",
                String.valueOf(saved.getId()),
                "127.0.0.1",
                "Verified and linked to parcel: " + saved.getParcel().getSurveyNumber()
        );

        return DocumentDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<DocumentDto> getDocumentsByParcel(Long parcelId) {
        return documentRepository.findByParcelId(parcelId).stream()
                .map(DocumentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DocumentDto getDocumentById(Long id) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));
        return DocumentDto.fromEntity(doc);
    }

    @Transactional(readOnly = true)
    public List<in.bhumisetu.dto.search.DocumentSearchResultDto> searchDocuments(
            String query,
            DocumentType documentType,
            String village,
            Boolean verifiedOnly) {

        List<Document> allDocs = documentRepository.findAll();
        String q = query != null ? query.trim().toLowerCase() : "";

        return allDocs.stream()
                .filter(doc -> {
                    if (verifiedOnly != null && verifiedOnly && !doc.isVerified()) {
                        return false;
                    }
                    if (documentType != null && doc.getDocumentType() != documentType) {
                        return false;
                    }
                    if (village != null && !village.isBlank() && doc.getParcel() != null) {
                        if (!doc.getParcel().getVillage().equalsIgnoreCase(village)) {
                            return false;
                        }
                    }
                    if (q.isEmpty()) {
                        return true;
                    }
                    boolean matchesFullText = doc.getFullText() != null && doc.getFullText().toLowerCase().contains(q);
                    boolean matchesMeta = doc.getExtractedMetadata() != null && doc.getExtractedMetadata().toLowerCase().contains(q);
                    boolean matchesFile = doc.getFileName() != null && doc.getFileName().toLowerCase().contains(q);
                    boolean matchesParcel = doc.getParcel() != null && (
                            (doc.getParcel().getSurveyNumber() != null && doc.getParcel().getSurveyNumber().toLowerCase().contains(q)) ||
                            (doc.getParcel().getUlpin() != null && doc.getParcel().getUlpin().toLowerCase().contains(q)) ||
                            (doc.getParcel().getVillage() != null && doc.getParcel().getVillage().toLowerCase().contains(q))
                    );
                    return matchesFullText || matchesMeta || matchesFile || matchesParcel;
                })
                .map(doc -> toSearchResult(doc, q))
                .sorted((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()))
                .collect(Collectors.toList());
    }

    private in.bhumisetu.dto.search.DocumentSearchResultDto toSearchResult(Document doc, String q) {
        java.util.List<String> matchedFields = new java.util.ArrayList<>();
        double score = 1.0;
        String snippet = "";

        if (doc.getParcel() != null) {
            if (!q.isEmpty()) {
                if (doc.getParcel().getSurveyNumber() != null && doc.getParcel().getSurveyNumber().equalsIgnoreCase(q)) {
                    score += 5.0;
                    matchedFields.add("surveyNumber");
                } else if (doc.getParcel().getSurveyNumber() != null && doc.getParcel().getSurveyNumber().toLowerCase().contains(q)) {
                    score += 3.0;
                    matchedFields.add("surveyNumber");
                }
                if (doc.getParcel().getUlpin() != null && doc.getParcel().getUlpin().toLowerCase().contains(q)) {
                    score += 4.0;
                    matchedFields.add("ulpin");
                }
                if (doc.getParcel().getVillage() != null && doc.getParcel().getVillage().toLowerCase().contains(q)) {
                    score += 2.0;
                    matchedFields.add("village");
                }
            }
        }

        if (!q.isEmpty() && doc.getFileName() != null && doc.getFileName().toLowerCase().contains(q)) {
            score += 2.0;
            matchedFields.add("fileName");
        }

        if (doc.getFullText() != null && !doc.getFullText().isEmpty()) {
            if (!q.isEmpty() && doc.getFullText().toLowerCase().contains(q)) {
                score += 3.0;
                matchedFields.add("fullText");
                snippet = extractSnippet(doc.getFullText(), q);
            } else if (snippet.isEmpty()) {
                snippet = doc.getFullText().length() > 180 ? doc.getFullText().substring(0, 180) + "..." : doc.getFullText();
            }
        }

        if (!q.isEmpty() && doc.getExtractedMetadata() != null && doc.getExtractedMetadata().toLowerCase().contains(q)) {
            matchedFields.add("metadata");
            score += 2.5;
        }

        ExtractedMetadataDto metadataDto = null;
        if (doc.getExtractedMetadata() != null) {
            try {
                metadataDto = objectMapper.readValue(doc.getExtractedMetadata(), ExtractedMetadataDto.class);
            } catch (Exception ignored) {}
        }

        if (snippet.isEmpty() && metadataDto != null) {
            snippet = String.format("Survey No: %s | ULPIN: %s | Village: %s | Reg: %s",
                    doc.getParcel() != null ? doc.getParcel().getSurveyNumber() : "N/A",
                    doc.getParcel() != null ? doc.getParcel().getUlpin() : "N/A",
                    doc.getParcel() != null ? doc.getParcel().getVillage() : "N/A",
                    metadataDto.getRegistrationNumber() != null ? metadataDto.getRegistrationNumber() : "Verified");
        }

        return in.bhumisetu.dto.search.DocumentSearchResultDto.builder()
                .id(doc.getId())
                .parcelId(doc.getParcel() != null ? doc.getParcel().getId() : null)
                .surveyNumber(doc.getParcel() != null ? doc.getParcel().getSurveyNumber() : null)
                .ulpin(doc.getParcel() != null ? doc.getParcel().getUlpin() : null)
                .village(doc.getParcel() != null ? doc.getParcel().getVillage() : null)
                .taluka(doc.getParcel() != null ? doc.getParcel().getTaluka() : null)
                .district(doc.getParcel() != null ? doc.getParcel().getDistrict() : null)
                .documentType(doc.getDocumentType())
                .documentTypeTitle(doc.getDocumentType() != null ? doc.getDocumentType().getTitle() : "Document")
                .fileName(doc.getFileName())
                .filePath(doc.getFilePath())
                .fileSizeBytes(doc.getFileSizeBytes())
                .verified(doc.isVerified())
                .uploadedAt(doc.getUploadedAt())
                .matchSnippet(snippet)
                .matchedFields(matchedFields)
                .extractedMetadata(metadataDto)
                .matchScore(score)
                .build();
    }

    private String extractSnippet(String text, String query) {
        int index = text.toLowerCase().indexOf(query.toLowerCase());
        if (index == -1) return text.length() > 180 ? text.substring(0, 180) + "..." : text;
        int start = Math.max(0, index - 60);
        int end = Math.min(text.length(), index + query.length() + 80);
        String prefix = start > 0 ? "..." : "";
        String suffix = end < text.length() ? "..." : "";
        return prefix + text.substring(start, end).replaceAll("[\\r\\n]+", " ").trim() + suffix;
    }
}
