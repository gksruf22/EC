package com.EC.backend.dto;

import com.EC.backend.domain.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDetailResponseDto {
    private Long id;                // 지원서 ID
    private String name;            // 이름
    private String studentId;       // 학번
    private String phoneNumber;     // 전화번호
    private String motive;
    private String experience;
    private ApplicationStatus status; // 현재 상태
}