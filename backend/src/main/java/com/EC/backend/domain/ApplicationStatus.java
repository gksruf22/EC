package com.EC.backend.domain;

public enum ApplicationStatus {
    PENDING,    // 대기 (정기 모집 기본값)
    APPROVED,   // 1차 합격(서류 합격)
    REJECTED,   // 불합격
    PASSED      // 최종 합격
}