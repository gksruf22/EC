package com.EC.backend.dto;

import com.EC.backend.domain.Event;
import com.EC.backend.domain.EventStatus;
import com.EC.backend.domain.EventType;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class EventResponseDto {
    private Long id;
    private String title;

    @NotBlank(message = "공지사항 설명은 필수 입력 항목입니다.")
    private String description;
    private EventType eventType;
    private EventStatus status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private int generation;

    public EventResponseDto(Event event) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.eventType = event.getEventType();
        this.status = event.getStatus();
        this.startDate = event.getStartDate();
        this.endDate = event.getEndDate();
        this.generation = event.getGeneration();
    }
}