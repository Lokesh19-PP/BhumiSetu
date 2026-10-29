package in.bhumisetu.dto.parcel;

import in.bhumisetu.domain.entity.OwnershipRecord;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OwnershipRecordDto {
    private Long id;
    private String ownerName;
    private String aadhaarMasked;
    private String ownershipShare;
    private String ownershipType;
    private LocalDate acquiredDate;
    private String mutationNumber;

    public static OwnershipRecordDto fromEntity(OwnershipRecord record) {
        return OwnershipRecordDto.builder()
                .id(record.getId())
                .ownerName(record.getOwnerName())
                .aadhaarMasked(record.getAadhaarMasked())
                .ownershipShare(record.getOwnershipShare())
                .ownershipType(record.getOwnershipType())
                .acquiredDate(record.getAcquiredDate())
                .mutationNumber(record.getMutationNumber())
                .build();
    }
}
