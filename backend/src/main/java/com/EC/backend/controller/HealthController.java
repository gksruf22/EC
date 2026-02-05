package com.EC.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public Map<String, String> health() {
        return Map.of(
            "status", "ok",
            "message", "Spring backend is live. Frontend coming soon."
        );
    }
}
