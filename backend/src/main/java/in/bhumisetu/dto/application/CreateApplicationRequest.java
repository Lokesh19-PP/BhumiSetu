package in.bhumisetu.dto.application;

import in.bhumisetu.domain.enums.ServiceType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateApplicationRequest {

    @NotNull(message = "Parcel ID is mandatory")
    private Long parcelId;

    @NotNull(message = "Service type is mandatory")
    private ServiceType serviceType;

    private String remarks;

    // Service-specific parameters
    private String proposedLandUse;
    private Double buildingHeightM;
    private Double builtUpAreaSqM;
    private String waterConnectionType;

    // Documents to associate
    private List<Long> documentIds;
}
