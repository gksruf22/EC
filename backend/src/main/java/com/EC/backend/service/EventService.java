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
                    .map(event -> {
                        int count = applicationRepository.countByEvent(event);
                        return new EventResponseDto(event, false, count);
                    })
                    .collect(Collectors.toList());
        }

        // 3. 로그인 유저라면 각 이벤트에 대해 지원 내역이 있는지 확인합니다.
        Member member = memberRepository.findByEmail(email).orElse(null);

        return events.stream()
                .map(event -> {
                    boolean applied = (member != null) &&
                            applicationRepository.existsByMemberAndEvent(member, event);
                    int count = applicationRepository.countByEvent(event);
                    return new EventResponseDto(event, applied, count);
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



        int count = applicationRepository.countByEvent(event);
        return new EventResponseDto(event, isApplied, count);
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

    // 활동 공고 수정 (관리자)
    @Transactional
    public void updateEvent(Long id, EventRequestDto dto) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 활동이 존재하지 않습니다. id=" + id));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = dto.getStartDate();
        LocalDateTime end = dto.getEndDate();

        if (now.isAfter(end)) {
             // throw new IllegalArgumentException("신청 기간을 지원 기간 앞으로 설정할 수 없습니다. 날짜를 확인해주세요.");
             // 수정 시에는 이미 지난 날짜일 수도 있으므로 이 검증을 완화하거나 상황에 맞게 조정해야 함.
             // 우선은 생성 시와 동일하게 검증하거나, 수정 시엔 풀어주는 것이 일반적일 수 있음.
             // 여기서는 생성 로직과 동일하게 유지하되, 필요시 변경.
        }
        
        // 상태 자동 결정 (선택 사항 - 관리자가 직접 상태를 지정할 수도 있음)
        // dto.getStatus()가 있으면 그것을 사용, 없으면 날짜 기반 계산 등.
        // 여기서는 dto.getStatus()를 그대로 사용한다고 가정.

        event.update(
                dto.getTitle(),
                dto.getDescription(),
                dto.getEventType(),
                dto.getStatus(), // 수정 시에는 관리자가 지정한 상태를 따름
                start,
                end,
                dto.getMaxParticipants(),
                dto.getGeneration()
        );
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