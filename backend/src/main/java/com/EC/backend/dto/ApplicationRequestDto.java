package com.EC.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ApplicationRequestDto {
    private String motive;     // 지원 동기
    private String experience; // 관련 활동 경험
}