package com.EC.backend.service;

import com.EC.backend.domain.*;
import com.EC.backend.dto.ApplicationRequestDto;
import com.EC.backend.dto.ApplicationResponseDto;
import com.EC.backend.dto.AdminApplicationResponseDto;
import com.EC.backend.dto.ApplicationDetailResponseDto;
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
    private final EventRepository eventRepository;
    private final com.EC.backend.repository.PassFailSettingsRepository passFailSettingsRepository;

    // 1. 지원서 제출 (apply)
    @Transactional
    public ApplicationResponseDto apply(String email, ApplicationRequestDto dto) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("해당 활동이 존재하지 않습니다."));

        LocalDateTime now = LocalDateTime.now();

        // [체크 1] 모집 시작 기간 확인
        if (event.getStatus() == EventStatus.READY || now.isBefore(event.getStartDate())) {
            throw new IllegalStateException("아직 모집 기간이 아닙니다. 모집 시작일: " + event.getStartDate());
        }

        // [체크 2] 모집 마감 기간 확인 (기존 로직 유지)
        if (event.getStatus() == EventStatus.CLOSED || now.isAfter(event.getEndDate())) {
            throw new IllegalStateException("모집이 마감된 활동입니다.");
        }

        // [체크 3] 중복 지원 확인 (이벤트별로 1회)
        if (applicationRepository.existsByMemberAndEvent(member, event)) {
            throw new IllegalStateException("이미 신청한 활동입니다.");
        }

        // [설정] 활동 유형에 따른 초기 상태 분기
        ApplicationStatus initialStatus = (event.getEventType() == EventType.RECRUITMENT)
                ? ApplicationStatus.PENDING // 동아리 정기 모집이면 PENDING
                : ApplicationStatus.APPROVED; // 이 외 활동(정기 세미나, 해커톤 등)은 바로 APPROVED

        // DTO -> Entity 변환 (이전의 motive/experience 대신 통합된 content 사용 권장)
        Application application = Application.builder()
                .member(member)
                .event(event)
                .motive(dto.getMotive())
                .experience(dto.getExperience())
                .project(dto.getProject())
                .status(initialStatus)
                .build();

        Application savedApplication = applicationRepository.save(application);
        return new ApplicationResponseDto(savedApplication);
    }

    // 2. 특정 기수 지원자 명단 조회 (관리자 전용)
    public List<AdminApplicationResponseDto> getApplicationsByGeneration(int generation) {
        // ⭐️ 바뀐 메서드 이름 호출: findByEventGeneration...
        return applicationRepository.findByEventGenerationOrderByCreatedAtDesc(generation).stream()
                .map(a -> new AdminApplicationResponseDto(
                        a.getId(),
                        a.getMember().getName(),
                        a.getMember().getStudentId(),
                        a.getMember().getPhoneNumber(),
                        a.getMotive(),
                        a.getExperience(),
                        a.getProject(),
                        a.getStatus(),
                        a.getEvent().getId(),
                        a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    // 3. 지원서 상세 정보 조회 (관리자 전용)
    public ApplicationDetailResponseDto getApplicationDetail(Long id) {
        Application a = applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("지원서를 찾을 수 없습니다. ID: " + id));

        return new ApplicationDetailResponseDto(
                a.getId(),
                a.getMember().getName(),
                a.getMember().getStudentId(),
                a.getMember().getPhoneNumber(),
                a.getMotive(),
                a.getExperience(),
                a.getProject(),
                a.getStatus(),
                a.getCreatedAt(),
                a.getEvent().getEventType(),
                a.getEvent().getTitle()
        );
    }

    // 4. 지원서 상태 변경 (관리자 전용)
    @Transactional
    public void updateStatus(Long applicationId, ApplicationStatus status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("해당 지원서를 찾을 수 없습니다."));
        application.updateStatus(status);
    }

    // 5. 결과 조회 (유저용)
    public com.EC.backend.dto.ResultResponseDto checkResult(Long eventId, String mode, String name, String studentId) {
        Member member = memberRepository.findByNameAndStudentId(name, studentId)
                .orElseThrow(() -> new IllegalArgumentException("일치하는 지원 정보가 없습니다."));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("해당 활동을 찾을 수 없습니다."));

        Application application = applicationRepository.findByMemberAndEvent(member, event)
                .orElseThrow(() -> new IllegalArgumentException("지원 이력을 찾을 수 없습니다."));

        // 조회 기간 검증 로직 추가
        com.EC.backend.domain.PassFailSettings settings = passFailSettingsRepository.findByEventIdAndMode(eventId, mode)
                .orElseThrow(() -> new IllegalArgumentException("현재 해당 전형의 합격자 조회 기간이 아닙니다."));

        if (!settings.isActive()) {
            throw new IllegalArgumentException("조회가 비활성화되어 있습니다.");
        }

        LocalDateTime now = LocalDateTime.now();
        if (settings.getStartDate() != null && now.isBefore(settings.getStartDate())) {
            throw new IllegalArgumentException("조회 기간 전입니다.");
        }
        if (settings.getEndDate() != null && now.isAfter(settings.getEndDate())) {
            throw new IllegalArgumentException("조회 기간이 지났습니다.");
        }

        String interviewLink = null;
        if ("first".equals(mode) && 
            (application.getStatus() == ApplicationStatus.APPROVED || application.getStatus() == ApplicationStatus.PASSED)) {
            interviewLink = settings.getInterviewLink();
        }

        return new com.EC.backend.dto.ResultResponseDto(application.getStatus().name(), interviewLink);
    }

    // 기존 컨트롤러와의 호환성을 위해
    public List<ApplicationResponseDto> findAllByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("해당 활동이 존재하지 않습니다."));

        return applicationRepository.findAllByEvent(event).stream()
                .map(ApplicationResponseDto::new) // Application 엔티티를 DTO로 변환
                .collect(Collectors.toList());
    }
}