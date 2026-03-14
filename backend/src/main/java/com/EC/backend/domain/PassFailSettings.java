package com.EC.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PassFailSettings extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false, length = 20)
    private String mode; // "first" or "final"

    @Column(nullable = false)
    private boolean isActive;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @Column(length = 2000)
    private String interviewLink; // 1차 합격자용 면접 시트 링크

    public void update(boolean isActive, LocalDateTime startDate, LocalDateTime endDate, String interviewLink) {
        this.isActive = isActive;
        this.startDate = startDate;
        this.endDate = endDate;
        this.interviewLink = interviewLink;
    }
}
