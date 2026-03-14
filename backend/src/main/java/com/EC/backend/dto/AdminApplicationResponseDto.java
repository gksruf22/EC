package com.EC.backend.dto;

import com.EC.backend.domain.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AdminApplicationResponseDto {
    private Long id;
    private String name;
    private String studentId;
    private String phoneNumber;
    private String motive;
    private String experience;
    private String project;
    private ApplicationStatus status;
    private Long eventId;
    private LocalDateTime appliedAt;
}