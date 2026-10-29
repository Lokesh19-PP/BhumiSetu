package in.bhumisetu.dto.ai;

import in.bhumisetu.domain.enums.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerifyDocumentRequest {

    private Long parcelId;
    private DocumentType documentType;
    private String surveyNumber;
    private String ulpin;
    private String village;
    private Double areaSqM;
    private String registrationNumber;
    private String documentDate;
    private List<String> ownerNames;
    private String verifiedNotes;
}
