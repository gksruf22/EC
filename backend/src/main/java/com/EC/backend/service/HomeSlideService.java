package com.EC.backend.service;

import com.EC.backend.domain.HomeSlide;
import com.EC.backend.dto.HomeSlideRequestDto;
import com.EC.backend.dto.HomeSlideResponseDto;
import com.EC.backend.repository.HomeSlideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HomeSlideService {

    private final HomeSlideRepository slideRepository;
    private final S3Service s3Service;

    // 전체 슬라이드 조회 (순서 정렬)
    public List<HomeSlideResponseDto> findAllSlides() {
        return slideRepository.findAllByOrderBySequenceAsc().stream()
                .map(HomeSlideResponseDto::new)
                .collect(Collectors.toList());
    }

    // 슬라이드 등록
    @Transactional
    public Long createSlide(HomeSlideRequestDto dto) {
        HomeSlide slide = HomeSlide.builder()
                .imageUrl(dto.getImageUrl())
                .title(dto.getTitle())
                .linkUrl(dto.getLinkUrl())
                .sequence(dto.getSequence())
                .build();
        return slideRepository.save(slide).getId();
    }

    // 슬라이드 삭제
    @Transactional
    public void deleteSlide(Long id) {
        HomeSlide slide = slideRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("슬라이드를 찾을 수 없습니다."));

        s3Service.deleteFile(slide.getImageUrl());

        slideRepository.delete(slide);
    }

    // 슬라이드 수정
    @Transactional
    public Long updateSlide(Long id, HomeSlideRequestDto dto) {
        HomeSlide slide = slideRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("슬라이드를 찾을 수 없습니다."));

        slide.update(dto.getImageUrl(), dto.getTitle(), dto.getLinkUrl(), dto.getSequence());
        return id;
    }

    // 슬라이드 순서 일괄 수정
    @Transactional
    public void updateSlideSequences(List<com.EC.backend.dto.HomeSlideSequenceDto> dtos) {
        for (com.EC.backend.dto.HomeSlideSequenceDto dto : dtos) {
            HomeSlide slide = slideRepository.findById(dto.getId())
                    .orElseThrow(() -> new IllegalArgumentException("슬라이드를 찾을 수 없습니다: " + dto.getId()));
            slide.updateSequence(dto.getSequence());
        }
    }
}