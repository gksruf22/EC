package com.EC.backend.dto;

import com.EC.backend.domain.EventStatus;
import com.EC.backend.domain.EventType;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class EventRequestDto {
    private String title;

    @NotBlank(message = "설명은 필수입니다.")
    private String description;

    private EventType eventType;
    private EventStatus status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer maxParticipants;
    private int generation;
}