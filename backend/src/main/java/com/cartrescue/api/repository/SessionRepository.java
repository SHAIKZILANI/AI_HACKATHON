package com.cartrescue.api.repository;

import com.cartrescue.api.entity.SessionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<SessionEntity, String> {
    
    Page<SessionEntity> findByStatus(String status, Pageable pageable);

    Page<SessionEntity> findByIsAbandonedTrue(Pageable pageable);

    @Query("SELECT COUNT(s) FROM SessionEntity s WHERE s.isAbandoned = true")
    Long countAbandonedSessions();

    @Query("SELECT COUNT(s) FROM SessionEntity s")
    Long countTotalSessions();

    @Query("SELECT SUM(s.cartValue) FROM SessionEntity s WHERE s.isAbandoned = true")
    Double calculateTotalAbandonedCartValue();

    List<SessionEntity> findTop10ByOrderByStartTimeDesc();
}
