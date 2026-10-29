package in.bhumisetu.repository;

import in.bhumisetu.domain.entity.LandParcel;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LandParcelRepository extends JpaRepository<LandParcel, Long> {

    Optional<LandParcel> findByUlpin(String ulpin);

    Optional<LandParcel> findBySurveyNumber(String surveyNumber);

    List<LandParcel> findByVillageIgnoreCase(String village);

    @Query("SELECT p FROM LandParcel p WHERE " +
           "LOWER(p.surveyNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.ulpin) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.village) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<LandParcel> searchByQuery(@Param("query") String query);

    // Spatial bounding-box query: find all parcels that intersect a given bbox geometry
    @Query("SELECT p FROM LandParcel p WHERE intersects(p.boundary, :envelope) = true")
    List<LandParcel> findWithinBoundingBox(@Param("envelope") Geometry envelope);

    // Spatial point-in-polygon query: find parcel that contains GPS coordinate point
    @Query("SELECT p FROM LandParcel p WHERE contains(p.boundary, :point) = true")
    List<LandParcel> findByPoint(@Param("point") Point point);
}
