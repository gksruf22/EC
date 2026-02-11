package com.EC.backend.service;

import com.EC.backend.config.JwtTokenProvider;
import com.EC.backend.domain.Member;
import com.EC.backend.domain.Role;
import com.EC.backend.dto.*;
import com.EC.backend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.Duration;
import java.util.Date;
import java.util.List;
import java.beans.Transient;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {
    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder; // 비밀번호 암호화. 나중에 Security 설정 시 빈으로 등록해야 함
    private final JwtTokenProvider jwtTokenProvider;
    private final StringRedisTemplate redisTemplate;
    private final EmailService emailService;

    @Transactional
    public Long signup(MemberSignupRequest dto) {
        // 이메일 중복 체크
        if(memberRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalStateException("이미 가입된 이메일입니다.");
        }

        // 이메일 인증 체크
        if (!emailService.isVerified(dto.getEmail())) {
            throw new IllegalArgumentException("이메일 인증이 완료되지 않았습니다.");
        }

        Member member = Member.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .name(dto.getName())
                .studentId(dto.getStudentId())
                .phoneNumber(dto.getPhoneNumber())
                .build();

        return memberRepository.save(member).getId();
    }

    public List<Member> findAll() {
        return memberRepository.findAll();
    }

    public Member findByEmail(String email) {
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }

    @Transactional
    public String login(LoginRequestDto dto) {
        Member member = memberRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        if(!passwordEncoder.matches(dto.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 틀렸습니다.");
        }

        return jwtTokenProvider.createToken(member.getEmail(), member.getRole().name());
    }

    // 내 정보 수정
    @Transactional
    public void updateMyInfo(String email, MemberUpdateRequestDto dto) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 더티 체킹을 이용한 필드 업데이트
        member.updateInfo(dto.getName(), dto.getPhoneNumber());
    }

    @Transactional
    public void updatePassword(String email, PasswordUpdateDto dto) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 1. 기존 비밀번호 일치 여부 확인
        if (!passwordEncoder.matches(dto.getOldPassword(), member.getPassword())) {
            throw new IllegalArgumentException("기존 비밀번호가 일치하지 않습니다.");
        }

        // 2. 새 비밀번호 암호화 및 저장
        String encodedPassword = passwordEncoder.encode(dto.getNewPassword());
        member.updatePassword(encodedPassword);
    }

    @Transactional
    public void logout(String token) {
        long expiration = jwtTokenProvider.getExpiration(token);
        long now = new Date().getTime();
        long remainTime = expiration - now;

        redisTemplate.opsForValue().set(
                "BLACKLIST: " + token,
                "logout",
                Duration.ofMillis(remainTime)
        );
    }

    public List<MemberResponseDto> findAllMembers() {
        return memberRepository.findAll().stream()
                .map(MemberResponseDto::new)
                .collect(Collectors.toList());
    }

    // 권한 변경 (USER <-> ADMIN) (관리자)
    @Transactional
    public void updateRole(Long id, Role role) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 회원을 찾을 수 없습니다."));
        member.setRole(role); // Member 엔티티에 @Setter가 있거나 updateRole 메서드가 있어야 합니다.
    }

    // 회원 강제 탈퇴 (관리자)
    @Transactional
    public void deleteMember(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new IllegalArgumentException("해당 회원이 존재하지 않습니다.");
        }
        memberRepository.deleteById(id);
    }
}
