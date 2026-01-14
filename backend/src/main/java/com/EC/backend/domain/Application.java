package com.EC.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter // 나중에 상태 변경(합격/불합격)을 위해 Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", unique = true)
    private Member member;

    @Column(columnDefinition = "TEXT")
    private String motive;

    @Column(columnDefinition = "TEXT")
    private String experience;

    // 합격 여부 상태
    @Enumerated(EnumType.STRING)
    @Builder.Default // Builder 사용 시 기본값을 유지하기 위해 필요
    private ApplicationStatus status = ApplicationStatus.PENDING;
}

