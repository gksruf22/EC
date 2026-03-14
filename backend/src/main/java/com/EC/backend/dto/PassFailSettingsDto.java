package com.EC.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PassFailSettingsDto {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private Integer generation;
    private String mode;
    
    @com.fasterxml.jackson.annotation.JsonProperty("isActive")
    private boolean isActive;
    
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String interviewLink;
}
