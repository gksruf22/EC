package com.EC.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ApplicationRequestDto {
    private int generation; // 기수 정보
    private Long eventId; // 어떤 활동에 지원하는지
    private String content; // 지원 내용 (일반 활동이면 비워둠)
}