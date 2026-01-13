package com.EC.backend.service;

import com.EC.backend.domain.Application;
import com.EC.backend.domain.Member;
import com.EC.backend.dto.ApplicationRequestDto;
import com.EC.backend.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    // 모집 기간 설정 (예시: 2026년 1월 1일 ~ 1월 31일)
    private final LocalDateTime START_DATE = LocalDateTime.of(2026, 1, 1, 0, 0);
    private final LocalDateTime END_DATE = LocalDateTime.of(2026, 1, 31, 23, 59);

    @Transactional
    public Application submit(ApplicationRequestDto dto, Member member) {
        // 지원 기간 확인 로직
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(START_DATE) || now.isAfter(END_DATE)) {
            throw new IllegalStateException("현재는 모집 기간이 아닙니다.");
        }

        // DTO -> Entity 변환 및 Member 연결
        Application application = Application.builder()
                .member(member) // 로그인된 회원 정보 연결
                .motive(dto.getMotive())
                .experience(dto.getExperience())
                .build();

        return applicationRepository.save(application);
    }

    public List<Application> findAll() {
        return applicationRepository.findAll();
    }
}