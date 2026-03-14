package com.EC.backend.controller;

import com.EC.backend.dto.PassFailSettingsDto;
import com.EC.backend.service.PassFailSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/pass-fail-settings")
public class AdminPassFailSettingsController {

    private final PassFailSettingsService settingsService;

    @GetMapping
    public ResponseEntity<PassFailSettingsDto> getSettings(
            @RequestParam Long eventId,
            @RequestParam String mode) {
        return ResponseEntity.ok(settingsService.getSettings(eventId, mode));
    }

    @PostMapping
    public ResponseEntity<PassFailSettingsDto> saveSettings(@RequestBody PassFailSettingsDto dto) {
        return ResponseEntity.ok(settingsService.saveSettings(dto));
    }

    @GetMapping("/all")
    public ResponseEntity<java.util.List<PassFailSettingsDto>> getAllSettings() {
        return ResponseEntity.ok(settingsService.getAllSettings());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSettings(@PathVariable Long id) {
        settingsService.deleteSettings(id);
        return ResponseEntity.ok().build();
    }
}
