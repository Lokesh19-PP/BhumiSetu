package in.bhumisetu.controller;

import in.bhumisetu.domain.entity.User;
import in.bhumisetu.dto.ai.OcrResultDto;
import in.bhumisetu.dto.ai.VerifyDocumentRequest;
import in.bhumisetu.dto.parcel.DocumentDto;
import in.bhumisetu.security.UserDetailsImpl;
import in.bhumisetu.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@Tag(name = "AI Document & OCR Digitization", description = "Endpoints for scanned property document upload, Tesseract OCR text extraction, and metadata verification")
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping(value = "/upload-ocr", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload scanned document & run OCR", description = "Uploads an image or PDF, executes Tesseract OCR with fallback extractor, extracts key metadata with confidence scores, and auto-matches to a parcel")
    public ResponseEntity<OcrResultDto> uploadAndOcr(
            @Parameter(description = "Scanned property document (PDF, PNG, JPG)")
            @RequestParam("file") MultipartFile file,
            @Parameter(description = "Optional explicit Parcel ID to associate with")
            @RequestParam(value = "parcelId", required = false) Long parcelId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User currentUser = userDetails != null ? userDetails.getUser() : null;
        OcrResultDto result = documentService.uploadAndOcr(file, parcelId, currentUser);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/verify")
    @Operation(summary = "Confirm & verify document metadata", description = "Saves user/officer reviewed metadata adjustments and confirms the link to the parcel record")
    public ResponseEntity<DocumentDto> verifyDocument(
            @PathVariable Long id,
            @RequestBody VerifyDocumentRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User verifier = userDetails != null ? userDetails.getUser() : null;
        DocumentDto verified = documentService.verifyDocument(id, request, verifier);
        return ResponseEntity.ok(verified);
    }

    @GetMapping("/parcel/{parcelId}")
    @Operation(summary = "Get documents for a parcel", description = "Lists all documents uploaded and verified for a specific land parcel")
    public ResponseEntity<List<DocumentDto>> getDocumentsByParcel(@PathVariable Long parcelId) {
        return ResponseEntity.ok(documentService.getDocumentsByParcel(parcelId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get document by ID", description = "Retrieves metadata, full text, and file path for a specific document")
    public ResponseEntity<DocumentDto> getDocumentById(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    @GetMapping("/sample")
    @Operation(summary = "Get sample 7/12 extract information", description = "Provides sample document details for instant 1-click OCR demonstration")
    public ResponseEntity<Map<String, Object>> getSampleDocument() {
        return ResponseEntity.ok(Map.of(
                "fileName", "sample_7_12_extract.jpg",
                "filePath", "/uploads/sample_7_12_extract.jpg",
                "documentType", "7/12 Satbara Extract",
                "surveyNumber", "125/2",
                "ulpin", "MH-PUN-HIN-001",
                "village", "Hinjewadi",
                "areaSqM", 3450.0,
                "ownerName", "Ramesh Narayan Patil",
                "regNumber", "MH-PUN-REG-89211"
        ));
    }
}
