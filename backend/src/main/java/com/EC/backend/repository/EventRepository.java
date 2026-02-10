package com.EC.backend.repository;

import com.EC.backend.domain.Event;
import com.EC.backend.domain.EventStatus;
import com.EC.backend.domain.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // 1. 특정 상태(예: OPEN)인 활동들만 조회 (홈화면용)
    List<Event> findByStatus(EventStatus status);

    // 2. 특정 타입(예: RECRUITMENT)인 활동들만 조회 (관리자용)
    List<Event> findByEventType(EventType eventType);

    // 3. 최신순으로 모든 활동 조회
    List<Event> findAllByOrderByIdDesc();
}