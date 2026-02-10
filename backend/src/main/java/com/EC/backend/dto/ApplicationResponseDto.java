package com.EC.backend.dto;

import com.EC.backend.domain.Application;
import com.EC.backend.domain.ApplicationStatus;
import lombok.Getter;

@Getter
public class ApplicationResponseDto {
    private Long id;
    private String name;        // 작성자 이름
    private String studentId;   // 학번
    private String eventTitle;  // 지원한 활동명 (추가)
    private String content;     // 지원 내용 (통합된 필드)
    private ApplicationStatus status; // 지원 상태 (추가)

    public ApplicationResponseDto(Application application) {
        this.id = application.getId();
        // 연관된 Member 엔티티에서 정보를 가져옵니다.
        this.name = application.getMember().getName();
        this.studentId = application.getMember().getStudentId();

        // 연관된 Event 엔티티에서 활동명을 가져옵니다.
        this.eventTitle = application.getEvent().getTitle();

        // 통합된 content 필드를 사용합니다.
        this.content = application.getContent();
        this.status = application.getStatus();
    }
}