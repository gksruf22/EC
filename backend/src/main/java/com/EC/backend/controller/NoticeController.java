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
@RequestMapping("/api")
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

    // 공지사항 등록 (관리자)
    @PostMapping("/api/admin/notices")
    public ResponseEntity<Long> createNotice(@RequestBody NoticeRequestDto dto, Principal principal) {
        return ResponseEntity.ok(noticeService.createNotice(dto, principal.getName()));
    }

    // 공지사항 수정 (관리자)
    @PutMapping("/admin/notices/{id}")
    public ResponseEntity<Void> updateNotice(
            @PathVariable Long id,
            @RequestBody NoticeRequestDto dto) {
        noticeService.updateNotice(id, dto);
        return ResponseEntity.ok().build();
    }

    // 공지사항 삭제 (관리자)
    @DeleteMapping("/admin/notices/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok().build();
    }
}