package com.EC.backend.controller;

import com.EC.backend.domain.EventStatus;
import com.EC.backend.dto.EventRequestDto;
import com.EC.backend.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/events")
public class AdminEventController {

    private final EventService eventService;

    // 1. 새로운 활동(정기모집/일반활동) 등록
    @PostMapping
    public ResponseEntity<Long> createEvent(@Valid @RequestBody EventRequestDto dto) {
        return ResponseEntity.ok(eventService.createEvent(dto));
    }

    // 2. 활동 상태 변경 (모집 중 -> 마감 등)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id, @RequestParam EventStatus status) {
        eventService.updateEventStatus(id, status);
        return ResponseEntity.ok().build();
    }

    // 3. 활동 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok().build();
    }
}