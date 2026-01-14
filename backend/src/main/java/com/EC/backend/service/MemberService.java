package com.EC.backend.service;

import com.EC.backend.config.JwtTokenProvider;
import com.EC.backend.domain.Member;
import com.EC.backend.dto.LoginRequestDto;
import com.EC.backend.repository.MemberRepository;
import com.EC.backend.dto.MemberSignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.beans.Transient;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder; // 비밀번호 암호화. 나중에 Security 설정 시 빈으로 등록해야 함
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public Long signup(MemberSignupRequest dto) {
        // 도메인 체크
        if(!dto.getEmail().endsWith("@seoultech.ac.kr")) {
            throw new IllegalArgumentException("서울과학기술대학교 이메일(@seoultech.ac.kr)로만 가입 가능합니다.");
        }

        if(memberRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalStateException("이미 가입된 이메일입니다.");
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

    @Transactional
    public String login(LoginRequestDto dto) {
        Member member = memberRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        if(!passwordEncoder.matches(dto.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 틀렸습니다.");
        }

        return jwtTokenProvider.createToken(member.getEmail());
    }
}
