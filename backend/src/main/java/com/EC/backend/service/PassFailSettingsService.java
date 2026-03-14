package com.EC.backend.service;

import com.EC.backend.domain.Event;
import com.EC.backend.domain.PassFailSettings;
import com.EC.backend.dto.PassFailSettingsDto;
import com.EC.backend.repository.EventRepository;
import com.EC.backend.repository.PassFailSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PassFailSettingsService {

    private final PassFailSettingsRepository settingsRepository;
    private final EventRepository eventRepository;

    public PassFailSettingsDto getSettings(Long eventId, String mode) {
        PassFailSettings settings = settingsRepository.findByEventIdAndMode(eventId, mode)
                .orElse(null);

        if (settings == null) {
            return PassFailSettingsDto.builder()
                    .eventId(eventId)
                    .mode(mode)
                    .isActive(false)
                    .build();
        }

        return convertToDto(settings);
    }

    @Transactional
    public PassFailSettingsDto saveSettings(PassFailSettingsDto dto) {
        PassFailSettings settings = settingsRepository.findByEventIdAndMode(dto.getEventId(), dto.getMode())
                .orElseGet(() -> {
                    Event event = eventRepository.findById(dto.getEventId())
                            .orElseThrow(() -> new IllegalArgumentException("Invalid Event ID"));
                    return PassFailSettings.builder()
                            .event(event)
                            .mode(dto.getMode())
                            .isActive(false)
                            .build();
                });

        settings.update(dto.isActive(), dto.getStartDate(), dto.getEndDate(), dto.getInterviewLink());
        return convertToDto(settingsRepository.save(settings));
    }

    public java.util.List<PassFailSettingsDto> getAllSettings() {
        return settingsRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public void deleteSettings(Long id) {
        settingsRepository.deleteById(id);
    }

    private PassFailSettingsDto convertToDto(PassFailSettings entity) {
        return PassFailSettingsDto.builder()
                .id(entity.getId())
                .eventId(entity.getEvent().getId())
                .eventTitle(entity.getEvent().getTitle())
                .generation(entity.getEvent().getGeneration())
                .mode(entity.getMode())
                .isActive(entity.isActive())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .interviewLink(entity.getInterviewLink())
                .build();
    }
}
