package com.EC.backend.controller;

import com.EC.backend.dto.ScheduleRequestDto;
import com.EC.backend.dto.ScheduleResponseDto;
import com.EC.backend.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    // 모든 일정 조회
    @GetMapping("/api/schedules")
    public ResponseEntity<List<ScheduleResponseDto>> getAllSchedules() {
        return ResponseEntity.ok(scheduleService.findAll());
    }

    // 일정 등록
    @PostMapping("/api/admin/schedules")
    public ResponseEntity<Long> createSchedule(@RequestBody ScheduleRequestDto dto) {
        return ResponseEntity.ok(scheduleService.create(dto));
    }

    // 일정 수정
    @PutMapping("/api/admin/schedules/{id}")
    public ResponseEntity<Void> updateSchedule(
            @PathVariable Long id,
            @RequestBody ScheduleRequestDto dto) {
        scheduleService.update(id, dto);
        return ResponseEntity.ok().build();
    }

    // 일정 삭제
    @DeleteMapping("/api/admin/schedules/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        scheduleService.delete(id);
        return ResponseEntity.ok().build();
    }
}