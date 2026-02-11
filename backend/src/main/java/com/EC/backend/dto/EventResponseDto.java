package com.EC.backend.dto;

import com.EC.backend.domain.Event;
import com.EC.backend.domain.EventStatus;
import com.EC.backend.domain.EventType;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class EventResponseDto {
    private Long id;
    private String title;
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