package com.EC.backend.controller;

import com.EC.backend.domain.Application;
import com.EC.backend.domain.ApplicationStatus;
import com.EC.backend.domain.Member;
import com.EC.backend.dto.ApplicationRequestDto;
import com.EC.backend.dto.ApplicationResponseDto;
import com.EC.backend.repository.MemberRepository;
import com.EC.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final MemberRepository memberRepository;

    // 지원서 제출 API
    @PostMapping
    public ResponseEntity<ApplicationResponseDto> submitApplication(@RequestBody ApplicationRequestDto dto, @AuthenticationPrincipal UserDetails userDetails) {
        // 이메일로 Member 찾기
        Member member = memberRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 지원서 제출
        return ResponseEntity.ok(applicationService.submit(dto, member));
    }

    // 지원 기간이 아닐 때 발생하는 에러 처리 로직
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    // 합격 여부 확인 API (로그인 불필요)
    @GetMapping("/result")
    public ResponseEntity<ApplicationStatus> getResult(@RequestParam String name, @RequestParam String studentId) {
        return ResponseEntity.ok(applicationService.checkResult(name, studentId));
    }

    // 관리자용 지원서 전체 조회 기능
    @GetMapping("/admin/all")
    public ResponseEntity<List<ApplicationResponseDto>> getAllApplications() {
        return ResponseEntity.ok(applicationService.findAll());
    }

    // 지원서의 상태(PENDING/ACCEPTED/REJECTED) 변경
    @PatchMapping("/admin/{id}/status")
    public ResponseEntity<String> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status) {

        applicationService.updateStatus(id, status);
        return ResponseEntity.ok("지원서 상태가 " + status + "(으)로 변경되었습니다.");
    }
}