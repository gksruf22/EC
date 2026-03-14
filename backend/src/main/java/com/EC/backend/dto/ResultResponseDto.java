package com.EC.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultResponseDto {
    private String status;           // "APPROVED", "PASSED", "REJECTED" 등
    private String interviewLink;    // 예약 링크
}
