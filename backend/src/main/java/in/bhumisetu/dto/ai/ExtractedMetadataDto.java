package in.bhumisetu.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExtractedMetadataDto {

    private String documentType;
    private String surveyNumber;
    private String ulpin;
    private String village;
    private String taluka;
    private String district;
    private Double areaSqM;
    private String documentDate;
    private String registrationNumber;
    private List<String> ownerNames;
    private Double confidence; // 0.0 to 1.0

    @Builder.Default
    private Map<String, Double> fieldConfidences = new HashMap<>();
}
