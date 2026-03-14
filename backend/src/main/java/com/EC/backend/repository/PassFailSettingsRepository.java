package com.EC.backend.repository;

import com.EC.backend.domain.PassFailSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PassFailSettingsRepository extends JpaRepository<PassFailSettings, Long> {
    Optional<PassFailSettings> findByEventIdAndMode(Long eventId, String mode);
}
