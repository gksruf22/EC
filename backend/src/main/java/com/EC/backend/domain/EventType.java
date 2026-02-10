package com.EC.backend.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EventType {
    RECRUITMENT("정기 모집"),
    GENERAL("일반 활동");

    private final String description;
}