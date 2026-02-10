package com.EC.backend.dto;

import com.EC.backend.domain.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AdminApplicationResponseDto {
    private Long id;
    private String name;
    private String studentId;
    private ApplicationStatus status;
}