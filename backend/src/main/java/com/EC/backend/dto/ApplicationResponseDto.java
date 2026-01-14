package com.EC.backend.dto;

import com.EC.backend.domain.Application;
import lombok.Getter;

@Getter
public class ApplicationResponseDto {
    private Long id;
    private String name;        // 작성자 이름
    private String studentId;   // 학번
    private String motive;      // 지원 동기
    private String experience;  // 경험

    public ApplicationResponseDto(Application application) {
        this.id = application.getId();
        this.name = application.getMember().getName();
        this.studentId = application.getMember().getStudentId();
        this.motive = application.getMotive();
        this.experience = application.getExperience();
    }
}