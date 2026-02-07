package com.EC.backend.service;

import com.EC.backend.config.JwtTokenProvider;
import com.EC.backend.domain.Member;
import com.EC.backend.dto.MemberSignupRequest;
import com.EC.backend.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private MemberService memberService;

    @BeforeEach
    void setUp() {
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    private MemberSignupRequest createSignupRequest(String email) {
        return MemberSignupRequest.builder()
                .email(email)
                .password("password123")
                .name("홍길동")
                .studentId("20231234")
                .phoneNumber("010-1234-5678")
                .build();
    }

    @Test
    @DisplayName("이메일 인증 없이 회원가입 시도 시 예외 발생")
    void signup_WithoutEmailVerification_ThrowsException() {
        // Given
        MemberSignupRequest signupRequest = createSignupRequest("test@seoultech.ac.kr");
        when(memberRepository.existsByEmail(anyString())).thenReturn(false);
        when(valueOperations.get("AUTH_COMPLETE:test@seoultech.ac.kr")).thenReturn(null);

        // When & Then
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            memberService.signup(signupRequest);
        });

        assertEquals("이메일 인증이 완료되지 않았습니다.", exception.getMessage());
        verify(memberRepository, never()).save(any(Member.class));
    }

    @Test
    @DisplayName("이메일 인증 완료 후 회원가입 성공")
    void signup_WithEmailVerification_Success() {
        // Given
        MemberSignupRequest signupRequest = createSignupRequest("test@seoultech.ac.kr");
        when(memberRepository.existsByEmail(anyString())).thenReturn(false);
        when(valueOperations.get("AUTH_COMPLETE:test@seoultech.ac.kr")).thenReturn("DONE");
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        
        Member savedMember = Member.builder()
                .id(1L)
                .email("test@seoultech.ac.kr")
                .password("encodedPassword")
                .name("홍길동")
                .studentId("20231234")
                .phoneNumber("010-1234-5678")
                .build();
        
        when(memberRepository.save(any(Member.class))).thenReturn(savedMember);

        // When
        Long memberId = memberService.signup(signupRequest);

        // Then
        assertNotNull(memberId);
        assertEquals(1L, memberId);
        verify(memberRepository).save(any(Member.class));
        verify(redisTemplate).delete("AUTH_COMPLETE:test@seoultech.ac.kr");
    }

    @Test
    @DisplayName("잘못된 이메일 도메인으로 회원가입 시도 시 예외 발생")
    void signup_WithInvalidEmailDomain_ThrowsException() {
        // Given
        MemberSignupRequest invalidRequest = createSignupRequest("test@gmail.com");

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            memberService.signup(invalidRequest);
        });

        assertEquals("서울과학기술대학교 이메일(@seoultech.ac.kr)로만 가입 가능합니다.", exception.getMessage());
    }

    @Test
    @DisplayName("이미 가입된 이메일로 회원가입 시도 시 예외 발생")
    void signup_WithExistingEmail_ThrowsException() {
        // Given
        MemberSignupRequest signupRequest = createSignupRequest("test@seoultech.ac.kr");
        when(memberRepository.existsByEmail("test@seoultech.ac.kr")).thenReturn(true);

        // When & Then
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            memberService.signup(signupRequest);
        });

        assertEquals("이미 가입된 이메일입니다.", exception.getMessage());
    }

    @Test
    @DisplayName("인증 완료 플래그가 DONE이 아닐 때 회원가입 실패")
    void signup_WithInvalidVerificationStatus_ThrowsException() {
        // Given
        MemberSignupRequest signupRequest = createSignupRequest("test@seoultech.ac.kr");
        when(memberRepository.existsByEmail(anyString())).thenReturn(false);
        when(valueOperations.get("AUTH_COMPLETE:test@seoultech.ac.kr")).thenReturn("INVALID");

        // When & Then
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            memberService.signup(signupRequest);
        });

        assertEquals("이메일 인증이 완료되지 않았습니다.", exception.getMessage());
        verify(memberRepository, never()).save(any(Member.class));
    }
}
