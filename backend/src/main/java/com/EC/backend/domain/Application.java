package com.EC.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Application extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member; // 지원자

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event; // 지원한 활동 (모집, 세미나 등)

    @Column(columnDefinition = "TEXT", nullable = false)
    private String motive;      // ⭐️ 지원 동기

    @Column(columnDefinition = "TEXT", nullable = false)
    private String experience;  // ⭐️ 경험 및 활동 사항

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status; // PENDING, APPROVED 등

    @Column(name = "gen_number", nullable = false)
    private int generation;

    // 관리자가 합격/불합격 상태를 변경할 때 사용
    public void updateStatus(ApplicationStatus status) {
        this.status = status;
    }
}