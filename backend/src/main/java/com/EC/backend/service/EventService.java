package com.EC.backend.service;

import com.EC.backend.domain.Event;
import com.EC.backend.domain.EventStatus;
import com.EC.backend.domain.Member;
import com.EC.backend.dto.EventRequestDto;
import com.EC.backend.dto.EventResponseDto;
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
public class EventService {

    private final EventRepository eventRepository;
    private final MemberRepository memberRepository;
    private final ApplicationRepository applicationRepository;

    // 모든 활동 조회 (최신순)
    public List<EventResponseDto> findAllVisibleEvents(String email) {
        // 1. 모든 이벤트를 가져옵니다.
        List<Event> events = eventRepository.findAll();

        // 2. 비로그인 유저라면 무조건 isApplied = false로 반환합니다.
        if (email == null) {
            return events.stream()
                    .map(event -> new EventResponseDto(event, false))
                    .collect(Collectors.toList());
        }

        // 3. 로그인 유저라면 각 이벤트에 대해 지원 내역이 있는지 확인합니다.
        Member member = memberRepository.findByEmail(email).orElse(null);

        return events.stream()
                .map(event -> {
                    boolean applied = (member != null) &&
                            applicationRepository.existsByMemberAndEvent(member, event);
                    return new EventResponseDto(event, applied);
                })
                .collect(Collectors.toList());
    }

    // 특정 활동 상세 조회 (Controller의 findById와 연결)
    public EventResponseDto findById(Long id, String email) {
        Event event = eventRepository.findById(id).orElseThrow();
        boolean isApplied = false;

        if (email != null) {
            Member member = memberRepository.findByEmail(email).orElse(null);
            isApplied = (member != null) && applicationRepository.existsByMemberAndEvent(member, event);
        }

        return new EventResponseDto(event, isApplied);
    }

    // 활동 공고 등록 (관리자)
    @Transactional
    public Long createEvent(EventRequestDto dto) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = dto.getStartDate();
        LocalDateTime end = dto.getEndDate();

        if (now.isAfter(end)) {
            throw new IllegalArgumentException("신청 기간을 지원 기간 앞으로 설정할 수 없습니다. 날짜를 확인해주세요.");
        }

        EventStatus status;
        if (now.isBefore(start)) {
            // 현재 시간이 시작 시간 전이면 READY
            status = EventStatus.READY;
        } else {
            // 그 외(현재 시간이 시작과 종료 사이)는 OPEN
            status = EventStatus.OPEN;
        }

        Event event = Event.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .eventType(dto.getEventType())
                .status(dto.getStatus())
                .startDate(start)
                .endDate(end)
                .maxParticipants(dto.getMaxParticipants())
                .generation(dto.getGeneration())
                .build();

        return eventRepository.save(event).getId();
    }

    // 3. 활동 상태 변경 (관리자: 마감 처리 등)
    @Transactional
    public void updateEventStatus(Long id, EventStatus status) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 활동이 존재하지 않습니다. id=" + id));
        event.updateStatus(status);
    }

    // 4. 특정 활동 삭제 (관리자)
    @Transactional
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 활동이 존재하지 않습니다. id=" + id));
        eventRepository.delete(event);
    }
}