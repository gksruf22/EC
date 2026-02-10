package com.EC.backend.dto;

import com.EC.backend.domain.EventStatus;
import com.EC.backend.domain.EventType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class EventRequestDto {
    private String title;
    private String description;
    private EventType eventType;
    private EventStatus status;
    private LocalDateTime deadline;
    private Integer maxParticipants;
}