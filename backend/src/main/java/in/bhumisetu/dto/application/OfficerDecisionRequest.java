package in.bhumisetu.dto.application;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfficerDecisionRequest {

    /**
     * Action to perform: APPROVE, REJECT, REQUEST_INFO, START_REVIEW
     */
    @NotBlank(message = "Action is mandatory (APPROVE, REJECT, REQUEST_INFO, START_REVIEW)")
    private String action;

    @NotBlank(message = "Remarks / reasoning comment is mandatory")
    private String comment;

    private String sanctionNumber;
}
