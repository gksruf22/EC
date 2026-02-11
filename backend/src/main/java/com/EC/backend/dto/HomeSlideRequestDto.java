package com.EC.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class HomeSlideRequestDto {
    private String imageUrl;
    private String title;
    private String linkUrl;
    private int sequence;
}