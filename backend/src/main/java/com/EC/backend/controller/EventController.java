package com.EC.backend.controller;

import com.EC.backend.dto.EventResponseDto;
import com.EC.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import java.security.Principal; // ⭐️ 추가: 유저 정보를 가져오기 위해 필요
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    // 1. 진행 중인 모든 활동 공고 조회
    @GetMapping
    public ResponseEntity<List<EventResponseDto>> getAllEvents(Principal principal) {
        String email = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(eventService.findAllVisibleEvents(email));
    }

    // 2. 특정 활동 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<EventResponseDto> getEvent(@PathVariable Long id, Principal principal) {
        String email = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(eventService.findById(id, email));
    }
}