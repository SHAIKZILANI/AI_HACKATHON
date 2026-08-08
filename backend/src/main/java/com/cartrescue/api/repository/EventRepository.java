package com.cartrescue.api.repository;

import com.cartrescue.api.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Long> {
    List<EventEntity> findBySessionSessionIdOrderByEventTimeAsc(String sessionId);
}
