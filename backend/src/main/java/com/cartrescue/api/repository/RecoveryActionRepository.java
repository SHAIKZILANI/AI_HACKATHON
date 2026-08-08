package com.cartrescue.api.repository;

import com.cartrescue.api.entity.RecoveryActionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecoveryActionRepository extends JpaRepository<RecoveryActionEntity, Long> {
    List<RecoveryActionEntity> findBySessionSessionId(String sessionId);

    @Query("SELECT SUM(r.estimatedMarginImpact) FROM RecoveryActionEntity r WHERE r.status = 'SENT'")
    Double calculateTotalRecoveredMargin();
}
