package com.EC.backend.controller;

import com.EC.backend.dto.HomeSlideRequestDto;
import com.EC.backend.dto.HomeSlideResponseDto;
import com.EC.backend.service.HomeSlideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class HomeSlideController {

    private final HomeSlideService slideService;

    // 전체 슬라이드 조회
    @GetMapping("/api/slides")
    public ResponseEntity<List<HomeSlideResponseDto>> getAllSlides() {
        return ResponseEntity.ok(slideService.findAllSlides());
    }

    // 슬라이드 등록 (관리자)
    @PostMapping("/api/admin/slides")
    public ResponseEntity<Long> createSlide(@RequestBody HomeSlideRequestDto dto) {
        return ResponseEntity.ok(slideService.createSlide(dto));
    }

    // 슬라이드 삭제 (관리자)
    @DeleteMapping("/api/admin/slides/{id}")
    public ResponseEntity<Void> deleteSlide(@PathVariable Long id) {
        slideService.deleteSlide(id);
        return ResponseEntity.ok().build();
    }
}