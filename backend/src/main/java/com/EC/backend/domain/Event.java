package com.EC.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Event extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // 활동 제목

    @Column(columnDefinition = "TEXT")
    private String description; // 활동 내용 설명

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType eventType; // RECRUITMENT 또는 GENERAL

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status; // OPEN 또는 CLOSED

    private LocalDateTime deadline; // 신청 마감 기한

    private Integer maxParticipants; // 최대 인원 (일반 활동 선착순 시 필요)

    // 관리자가 상태를 바꿀 때 사용하는 메서드
    public void updateStatus(EventStatus status) {
        this.status = status;
    }
}