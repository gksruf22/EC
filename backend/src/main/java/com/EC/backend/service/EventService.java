package com.EC.backend.service;

import com.EC.backend.domain.Event;
import com.EC.backend.domain.EventStatus;
import com.EC.backend.dto.EventRequestDto;
import com.EC.backend.dto.EventResponseDto;
import com.EC.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventService {

    private final EventRepository eventRepository;

    // 모든 활동 조회 (Controller의 findAllVisibleEvents와 연결)
    public List<EventResponseDto> findAllVisibleEvents() {
        return eventRepository.findAll().stream()
                .map(EventResponseDto::new) // Entity를 DTO로 변환
                .collect(Collectors.toList());
    }

    // 특정 활동 상세 조회 (Controller의 findById와 연결)
    public EventResponseDto findById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 활동을 찾을 수 없습니다. ID: " + id));
        return new EventResponseDto(event);
    }

    // 활동 공고 등록 (관리자)
    @Transactional
    public Long createEvent(EventRequestDto dto) {
        Event event = Event.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .eventType(dto.getEventType())
                .status(dto.getStatus())
                .deadline(dto.getDeadline())
                .maxParticipants(dto.getMaxParticipants())
                .build();

        return eventRepository.save(event).getId();
    }

    // 모든 활동 조회 (최신순)
    public List<EventResponseDto> getAllEvents() {
        return eventRepository.findAllByOrderByIdDesc().stream()
                .map(EventResponseDto::new)
                .collect(Collectors.toList());
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