package com.EC.backend.dto;

import com.EC.backend.domain.Notice;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class NoticeResponseDto {
    private final Long id;
    private final String title;
    private final String content;
    private final String authorName;
    private final LocalDateTime createdAt;

    public NoticeResponseDto(Notice notice) {
        this.id = notice.getId();
        this.title = notice.getTitle();
        this.content = notice.getContent();
        this.authorName = notice.getAuthor().getName();
        this.createdAt = notice.getCreatedAt();
    }
}