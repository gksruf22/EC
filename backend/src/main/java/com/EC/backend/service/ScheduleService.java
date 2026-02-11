package com.EC.backend.service;

import com.EC.backend.domain.Schedule;
import com.EC.backend.dto.ScheduleRequestDto;
import com.EC.backend.dto.ScheduleResponseDto;
import com.EC.backend.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    // 전체 일정 조회
    public List<ScheduleResponseDto> findAll() {
        return scheduleRepository.findAll().stream()
                .map(ScheduleResponseDto::new)
                .collect(Collectors.toList());
    }

    // 월별 일정 조회 (프론트에서 start, end를 해당 월의 시작/끝으로 보내줌)
    public List<ScheduleResponseDto> findByMonth(LocalDateTime start, LocalDateTime end) {
        return scheduleRepository.findByStartDateTimeBetweenOrderByStartDateTimeAsc(start, end).stream()
                .map(ScheduleResponseDto::new)
                .collect(Collectors.toList());
    }

    // 일정 등록
    @Transactional
    public Long create(ScheduleRequestDto dto) {
        Schedule schedule = Schedule.builder()
                .title(dto.getTitle())
                .startDateTime(dto.getStartDateTime())
                .endDateTime(dto.getEndDateTime())
                .relatedLink(dto.getRelatedLink())
                .build();
        return scheduleRepository.save(schedule).getId();
    }

    // 일정 수정
    @Transactional
    public void update(Long id, ScheduleRequestDto dto) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 일정을 찾을 수 없습니다. ID: " + id));

        schedule.update(
                dto.getTitle(),
                dto.getStartDateTime(),
                dto.getEndDateTime(),
                dto.getRelatedLink()
        );
    }

    // 일정 삭제
    @Transactional
    public void delete(Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new IllegalArgumentException("삭제할 일정이 존재하지 않습니다. ID: " + id);
        }
        scheduleRepository.deleteById(id);
    }
}