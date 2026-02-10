package com.EC.backend.controller;

import com.EC.backend.dto.NoticeRequestDto;
import com.EC.backend.dto.NoticeResponseDto;
import com.EC.backend.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    // 공지사항 전체 조회
    @GetMapping("/api/notices")
    public ResponseEntity<List<NoticeResponseDto>> getAllNotices() {
        return ResponseEntity.ok(noticeService.findAllNotices());
    }

    // 공지사항 상세 조회
    @GetMapping("/api/notices/{id}")
    public ResponseEntity<NoticeResponseDto> getNotice(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.findById(id));
    }

    // 공지사항 등록 (어드민 전용)
    @PostMapping("/api/admin/notices")
    public ResponseEntity<Long> createNotice(@RequestBody NoticeRequestDto dto, Principal principal) {
        return ResponseEntity.ok(noticeService.createNotice(dto, principal.getName()));
    }
}