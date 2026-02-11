package com.EC.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class ScheduleRequestDto {
    private String title;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String relatedLink;
}