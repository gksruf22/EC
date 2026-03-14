package com.EC.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ApplicationRequestDto {
    private int generation; // 기수 정보
    private Long eventId; // 어떤 활동에 지원하는지

    private String motive;

    private String experience;

    private String project;
}