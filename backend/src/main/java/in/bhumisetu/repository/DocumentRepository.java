package in.bhumisetu.repository;

import in.bhumisetu.domain.entity.Document;
import in.bhumisetu.domain.entity.LandParcel;
import in.bhumisetu.domain.enums.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByParcel(LandParcel parcel);
    List<Document> findByParcelId(Long parcelId);
    List<Document> findByDocumentType(DocumentType documentType);

    @Query("SELECT d FROM Document d WHERE " +
           "LOWER(d.fullText) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.extractedMetadata) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.fileName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Document> smartSearch(@Param("query") String query);

    @Query("SELECT d FROM Document d WHERE " +
           "d.parcel.id = :parcelId AND (" +
           "LOWER(d.fullText) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.extractedMetadata) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.fileName) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Document> smartSearchByParcel(@Param("parcelId") Long parcelId, @Param("query") String query);
}
