package com.EC.backend.dto;

import com.EC.backend.domain.Notice;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class NoticeResponseDto {
    private Long id;
    private String title;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;

    public NoticeResponseDto(Notice notice) {
        this.id = notice.getId();
        this.title = notice.getTitle();
        this.content = notice.getContent();
        this.imageUrl = notice.getImageUrl();
        this.createdAt = notice.getCreatedAt();
    }
}