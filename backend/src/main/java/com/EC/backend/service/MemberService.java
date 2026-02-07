package com.EC.backend.service;

import com.EC.backend.config.JwtTokenProvider;
import com.EC.backend.domain.Member;
import com.EC.backend.dto.LoginRequestDto;
import com.EC.backend.repository.MemberRepository;
import com.EC.backend.dto.MemberSignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.Duration;
import java.util.Date;
import java.util.List;
import java.beans.Transient;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {
    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder; // 비밀번호 암호화. 나중에 Security 설정 시 빈으로 등록해야 함
    private final JwtTokenProvider jwtTokenProvider;
    private final StringRedisTemplate redisTemplate;

    @Transactional
    public Long signup(MemberSignupRequest dto) {
        // 도메인 체크
        if(!dto.getEmail().endsWith("@seoultech.ac.kr")) {
            throw new IllegalArgumentException("서울과학기술대학교 이메일(@seoultech.ac.kr)로만 가입 가능합니다.");
        }

        if(memberRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalStateException("이미 가입된 이메일입니다.");
        }

        // 이메일 인증 완료 여부 확인 (서버 사이드 검증)
        String verificationStatus = redisTemplate.opsForValue().get("AUTH_COMPLETE:" + dto.getEmail());
        if (verificationStatus == null || !verificationStatus.equals("DONE")) {
            throw new IllegalStateException("이메일 인증이 완료되지 않았습니다.");
        }

        Member member = Member.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .name(dto.getName())
                .studentId(dto.getStudentId())
                .phoneNumber(dto.getPhoneNumber())
                .build();

        Member savedMember = memberRepository.save(member);
        
        // 회원가입 완료 후 인증 완료 플래그 삭제 (재사용 방지)
        redisTemplate.delete("AUTH_COMPLETE:" + dto.getEmail());
        
        return savedMember.getId();
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
}
