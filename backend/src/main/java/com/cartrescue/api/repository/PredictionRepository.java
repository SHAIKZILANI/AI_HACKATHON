package com.cartrescue.api.repository;

import com.cartrescue.api.entity.PredictionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PredictionRepository extends JpaRepository<PredictionEntity, Long> {
    Optional<PredictionEntity> findBySessionSessionId(String sessionId);

    Page<PredictionEntity> findByIntentCategory(String intentCategory, Pageable pageable);

    @Query("SELECT p.intentCategory, COUNT(p) FROM PredictionEntity p GROUP BY p.intentCategory")
    List<Object[]> countGroupByIntentCategory();

    @Query("SELECT p.recommendedAction, COUNT(p) FROM PredictionEntity p GROUP BY p.recommendedAction")
    List<Object[]> countGroupByRecommendedAction();
}
