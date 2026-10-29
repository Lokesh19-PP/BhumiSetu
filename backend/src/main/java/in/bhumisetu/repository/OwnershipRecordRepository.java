package in.bhumisetu.repository;

import in.bhumisetu.domain.entity.LandParcel;
import in.bhumisetu.domain.entity.OwnershipRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OwnershipRecordRepository extends JpaRepository<OwnershipRecord, Long> {
    List<OwnershipRecord> findByParcel(LandParcel parcel);
    List<OwnershipRecord> findByParcelId(Long parcelId);
    List<OwnershipRecord> findByOwnerNameContainingIgnoreCase(String ownerName);
}
