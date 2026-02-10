package com.EC.backend.controller;

import com.EC.backend.domain.ApplicationStatus;
import com.EC.backend.dto.AdminApplicationResponseDto;
import com.EC.backend.dto.ApplicationDetailResponseDto;
import com.EC.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/applications")
public class AdminApplicationController {

    private final ApplicationService applicationService;

    // 1. [명단 탭] 특정 기수의 지원자 명단 가져오기
    @GetMapping("/generation/{gen}")
    public ResponseEntity<List<AdminApplicationResponseDto>> getList(@PathVariable int gen) {
        return ResponseEntity.ok(applicationService.getApplicationsByGeneration(gen));
    }

    // 2. [상세 탭] 특정 지원자의 상세 정보 가져오기
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDetailResponseDto> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationDetail(id));
    }

    // 3. [상태 변경] 면접 중 합격/불합격/대기 상태 즉시 반영
    // 사용법: PATCH /api/admin/applications/1/status?status=APPROVED
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status) {
        applicationService.updateStatus(id, status);
        return ResponseEntity.ok().build();
    }
}