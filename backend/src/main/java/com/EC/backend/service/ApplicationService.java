package com.EC.backend.service;

import com.EC.backend.domain.*;
import com.EC.backend.dto.ApplicationRequestDto;
import com.EC.backend.dto.ApplicationResponseDto;
import com.EC.backend.repository.ApplicationRepository;
import com.EC.backend.repository.EventRepository;
import com.EC.backend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final MemberRepository memberRepository;
    private final EventRepository eventRepository; // 추가

    // 1. 지원서 제출 (apply)
    @Transactional
    public ApplicationResponseDto apply(String email, ApplicationRequestDto dto) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("해당 활동이 존재하지 않습니다."));

        // [체크 1] 모집 기간 확인 (DB의 deadline 기준)
        if (event.getStatus() == EventStatus.CLOSED || LocalDateTime.now().isAfter(event.getDeadline())) {
            throw new IllegalStateException("모집이 마감된 활동입니다.");
        }

        // [체크 2] 중복 지원 확인 (이벤트별로 1회)
        if (applicationRepository.existsByMemberAndEvent(member, event)) {
            throw new IllegalStateException("이미 신청한 활동입니다.");
        }

        // [설정] 활동 유형에 따른 초기 상태 분기
        ApplicationStatus initialStatus = (event.getEventType() == EventType.RECRUITMENT)
                ? ApplicationStatus.PENDING
                : ApplicationStatus.APPROVED;

        // DTO -> Entity 변환 (이전의 motive/experience 대신 통합된 content 사용 권장)
        Application application = Application.builder()
                .member(member)
                .event(event)
                .content(dto.getContent())
                .status(initialStatus)
                .build();

        Application savedApplication = applicationRepository.save(application);
        return new ApplicationResponseDto(savedApplication);
    }

    // 2. 결과 조회 (로그인 기반으로 변경 추천하나, 기존 로직 유지)
    public ApplicationStatus checkResult(Long eventId, String name, String studentId) {
        // 특정 이벤트에 대한 결과 조회로 업그레이드
        Member member = memberRepository.findByNameAndStudentId(name, studentId)
                .orElseThrow(() -> new IllegalArgumentException("일치하는 지원 정보가 없습니다."));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("해당 활동을 찾을 수 없습니다."));

        Application application = applicationRepository.findByMemberAndEvent(member, event)
                .orElseThrow(() -> new IllegalArgumentException("지원 이력을 찾을 수 없습니다."));

        return application.getStatus();
    }

    // 3. 지원서 상태 변경 (관리자)
    @Transactional
    public void updateStatus(Long applicationId, ApplicationStatus status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("해당 지원서를 찾을 수 없습니다."));
        application.updateStatus(status);
    }

    // 4. 특정 이벤트의 모든 지원서 조회 (관리자용)
    public List<ApplicationResponseDto> findAllByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("해당 활동이 존재하지 않습니다."));

        return applicationRepository.findAllByEvent(event).stream()
                .map(ApplicationResponseDto::new)
                .collect(Collectors.toList());
    }
}