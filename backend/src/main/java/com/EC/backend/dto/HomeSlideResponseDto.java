package com.EC.backend.dto;

import com.EC.backend.domain.HomeSlide;
import lombok.Getter;

@Getter
public class HomeSlideResponseDto {
    private Long id;
    private String imageUrl;
    private String title;
    private String linkUrl;
    private int sequence;

    public HomeSlideResponseDto(HomeSlide slide) {
        this.id = slide.getId();
        this.imageUrl = slide.getImageUrl();
        this.title = slide.getTitle();
        this.linkUrl = slide.getLinkUrl();
        this.sequence = slide.getSequence();
    }
}