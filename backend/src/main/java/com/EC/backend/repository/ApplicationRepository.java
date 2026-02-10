package com.EC.backend.repository;

import com.EC.backend.domain.Application;
import com.EC.backend.domain.Event;
import com.EC.backend.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // 1. [중복 체크용] 특정 회원이 이 특정 활동에 이미 지원했는가? (필수)
    boolean existsByMemberAndEvent(Member member, Event event);

    // 2. [마이페이지용] 특정 회원이 지원한 모든 지원서 목록 보기
    List<Application> findAllByMember(Member member);

    // 3. [관리자용] 특정 활동에 지원한 모든 지원서 목록 보기
    List<Application> findAllByEvent(Event event);

    // 4. [조회용] 특정 회원이 특정 활동에 쓴 지원서 딱 하나만 가져오기
    Optional<Application> findByMemberAndEvent(Member member, Event event);
}