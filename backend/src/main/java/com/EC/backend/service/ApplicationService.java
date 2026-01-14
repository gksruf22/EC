package com.EC.backend.service;

import com.EC.backend.domain.Application;
import com.EC.backend.domain.ApplicationStatus;
import com.EC.backend.domain.Member;
import com.EC.backend.dto.ApplicationRequestDto;
import com.EC.backend.dto.ApplicationResponseDto;
import com.EC.backend.repository.ApplicationRepository;
import com.EC.backend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final MemberRepository memberRepository;

    // 모집 기간 설정 (예시: 2026년 1월 1일 ~ 1월 31일)
    private final LocalDateTime START_DATE = LocalDateTime.of(2026, 1, 1, 0, 0);
    private final LocalDateTime END_DATE = LocalDateTime.of(2026, 1, 31, 23, 59);

    // 합격자 조회 기간 설정 (예시: 2026년 2월 1일 ~ 2월 7일)
    private final LocalDateTime RESULT_START_DATE = LocalDateTime.of(2026, 2, 1, 0, 0);
    private final LocalDateTime RESULT_END_DATE = LocalDateTime.of(2026, 2, 7, 23, 59);

    public ApplicationStatus checkResult(String name, String studentId) {
        // 조회 기간 확인 로직
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(RESULT_START_DATE) || now.isAfter(RESULT_END_DATE)) {
            throw new IllegalStateException("합격자 조회 기간이 아닙니다.");
        }

        // 이름, 학번으로 회원 조회
        Member member = memberRepository.findByNameAndStudentId(name, studentId)
                .orElseThrow(() -> new IllegalArgumentException("일치하는 지원 정보가 없습니다."));

        // 해당 회원의 지원서 조회
        Application application = applicationRepository.findByMember(member)
                .orElseThrow(() -> new IllegalArgumentException("지원 이력을 찾을 수 없습니다."));

        return application.getStatus();
    }

    @Transactional
    public ApplicationResponseDto submit(ApplicationRequestDto dto, Member member) {
        // 지원 기간 확인 로직
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(START_DATE) || now.isAfter(END_DATE)) {
            throw new IllegalStateException("현재는 모집 기간이 아닙니다.");
        }

        // 중복 지원 확인 로직
        if (applicationRepository.existsByMember(member)) {
            throw new IllegalStateException("이미 지원서를 제출하셨습니다. 지원서는 1인당 1회만 제출 가능합니다.");
        }

        // DTO -> Entity 변환 및 Member 연결
        Application application = Application.builder()
                .member(member)
                .motive(dto.getMotive())
                .experience(dto.getExperience())
                .build();

        Application savedApplication = applicationRepository.save(application);
        return new ApplicationResponseDto(savedApplication);
    }

    // 지원사 상태(대기/합격/불합격) 변경 로직
    @Transactional
    public void updateStatus(Long applicationId, ApplicationStatus status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("해당 지원서를 찾을 수 없습니다."));

        application.setStatus(status);
    }

    public List<ApplicationResponseDto> findAll() {
        return applicationRepository.findAll().stream()
                .map(ApplicationResponseDto::new)
                .collect(Collectors.toList());
    }
}