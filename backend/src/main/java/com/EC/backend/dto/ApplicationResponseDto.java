package com.EC.backend.dto;

import com.EC.backend.domain.Application;
import com.EC.backend.domain.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class ApplicationResponseDto {
    private Long id;
    private String name;
    private String studentId;
    private String eventTitle;

    @NotBlank(message = "지원 동기를 입력해주세요.")
    private String motive;

    @NotBlank(message = "경험 및 활동 사항을 입력해주세요.")
    private String experience;

    private ApplicationStatus status;

    public ApplicationResponseDto(Application application) {
        this.id = application.getId();
        this.name = application.getMember().getName();
        this.studentId = application.getMember().getStudentId();
        this.eventTitle = application.getEvent().getTitle();
        this.motive = application.getMotive();
        this.experience = application.getExperience();
        this.status = application.getStatus();
    }
}