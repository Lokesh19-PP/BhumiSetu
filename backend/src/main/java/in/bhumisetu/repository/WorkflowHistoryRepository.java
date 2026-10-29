package in.bhumisetu.repository;

import in.bhumisetu.domain.entity.Application;
import in.bhumisetu.domain.entity.WorkflowHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowHistoryRepository extends JpaRepository<WorkflowHistory, Long> {
    List<WorkflowHistory> findByApplication(Application application);
    List<WorkflowHistory> findByApplicationIdOrderByTimestampAsc(Long applicationId);
}
