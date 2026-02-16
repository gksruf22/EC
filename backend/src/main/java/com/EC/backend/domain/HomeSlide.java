package com.EC.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeSlide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageUrl; // 슬라이드 이미지 주소

    private String title;    // 큰 제목
    private String linkUrl;  // 클릭 시 이동할 링크 (공지사항 등)

    private int sequence;    // 슬라이드 노출 순서 (낮을수록 앞순서)

    public void update(String imageUrl, String title, String linkUrl, int sequence) {
        this.imageUrl = imageUrl;
        this.title = title;
        this.linkUrl = linkUrl;
        this.sequence = sequence;
    }

    public void updateSequence(int sequence) {
        this.sequence = sequence;
    }
}