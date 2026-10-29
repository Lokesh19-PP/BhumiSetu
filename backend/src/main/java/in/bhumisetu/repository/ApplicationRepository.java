package in.bhumisetu.repository;

import in.bhumisetu.domain.entity.Application;
import in.bhumisetu.domain.entity.Department;
import in.bhumisetu.domain.entity.LandParcel;
import in.bhumisetu.domain.entity.User;
import in.bhumisetu.domain.enums.ApplicationStatus;
import in.bhumisetu.domain.enums.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Optional<Application> findByApplicationNumber(String applicationNumber);

    List<Application> findByApplicant(User applicant);

    List<Application> findByApplicantIdOrderByCreatedAtDesc(Long applicantId);

    List<Application> findByDepartmentOrderByCreatedAtDesc(Department department);

    List<Application> findByDepartmentIdOrderByCreatedAtDesc(Long departmentId);

    List<Application> findByDepartmentIdAndStatusOrderByCreatedAtDesc(Long departmentId, ApplicationStatus status);

    List<Application> findByParcel(LandParcel parcel);

    List<Application> findByParcelIdOrderByCreatedAtDesc(Long parcelId);

    List<Application> findByStatusOrderByCreatedAtDesc(ApplicationStatus status);

    long countByStatus(ApplicationStatus status);

    long countByServiceType(ServiceType serviceType);

    long countByDepartment(Department department);

    @Query("SELECT a.status, COUNT(a) FROM Application a GROUP BY a.status")
    List<Object[]> countGroupedByStatus();

    @Query("SELECT a.serviceType, COUNT(a) FROM Application a GROUP BY a.serviceType")
    List<Object[]> countGroupedByServiceType();

    @Query("SELECT a.department.name, COUNT(a) FROM Application a GROUP BY a.department.name")
    List<Object[]> countGroupedByDepartment();
}
