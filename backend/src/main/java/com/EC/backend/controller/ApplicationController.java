package com.EC.backend.controller;

import com.EC.backend.domain.ApplicationStatus;
import com.EC.backend.dto.ApplicationRequestDto;
import com.EC.backend.dto.ApplicationResponseDto;
import com.EC.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    // 1. 지원서 제출 API (유저)
    @PostMapping
    public ResponseEntity<ApplicationResponseDto> apply(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ApplicationRequestDto dto) {

        // 서비스에서 이메일을 통해 Member를 찾도록 수정되었습니다.
        return ResponseEntity.ok(applicationService.apply(userDetails.getUsername(), dto));
    }

    // 2. 결과 조회 API (로그인 불필요 - 특정 이벤트 ID 추가)
    @GetMapping("/result")
    public ResponseEntity<com.EC.backend.dto.ResultResponseDto> getResult(
            @RequestParam Long eventId,
            @RequestParam String mode,
            @RequestParam String name,
            @RequestParam String studentId) {

        return ResponseEntity.ok(applicationService.checkResult(eventId, mode, name, studentId));
    }

    // 3. 관리자용: 특정 활동의 지원서 전체 조회
    @GetMapping("/admin/event/{eventId}")
    public ResponseEntity<List<ApplicationResponseDto>> getApplicationsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(applicationService.findAllByEvent(eventId));
    }

    // 4. 관리자용: 지원서 상태(합격/불합격) 변경
    @PatchMapping("/admin/{id}/status")
    public ResponseEntity<String> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status) {

        applicationService.updateStatus(id, status);
        return ResponseEntity.ok("지원서 상태가 " + status + "(으)로 변경되었습니다.");
    }

    // 에러 처리 로직
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
}