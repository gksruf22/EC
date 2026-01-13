package com.EC.backend.controller;

import com.EC.backend.domain.Application;
import com.EC.backend.dto.ApplicationRequestDto;
import com.EC.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    // 지원서 제출 API
    @PostMapping
    public ResponseEntity<Application> submitApplication(@RequestBody ApplicationRequestDto dto) {
        // 임시로 DB에서 첫 번째 회원을 가져와 연결하거나,
        // 나중에 시큐리티가 완성되면 로그인된 사용자 정보를 넘겨줄 예정입니다.
        // 현재는 테스트를 위해 서비스 로직 호출 방식을 맞춰둡니다.

        // Member currentMember = ... (로그인 유저 가져오는 로직 들어갈 자리)
        // return ResponseEntity.ok(applicationService.submit(dto, currentMember));

        return ResponseEntity.status(HttpStatus.CREATED).build(); // 임시 응답
    }

    // 모든 지원서 조회 API
    @GetMapping
    public List<Application> getAllApplications() {
        return applicationService.findAll();
    }

    // 지원 기간이 아닐 때 발생하는 에러 처리 로직
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}