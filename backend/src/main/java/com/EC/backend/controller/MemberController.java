package com.EC.backend.controller;

import com.EC.backend.config.JwtTokenProvider;
import com.EC.backend.domain.Member;
import com.EC.backend.dto.LoginRequestDto;
import com.EC.backend.dto.MemberSignupRequest;
import com.EC.backend.dto.MemberUpdateRequestDto;
import com.EC.backend.dto.PasswordUpdateDto;
import com.EC.backend.service.EmailService;
import com.EC.backend.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class MemberController {

    private final EmailService emailService;
    private final MemberService memberService;
    private final JwtTokenProvider jwtTokenProvider;

    // 인증 코드 요청
    @PostMapping("/email-verification/request")
    public ResponseEntity<String> requestVerification(@RequestParam String email) {
        emailService.sendVerificationCode(email);
        return ResponseEntity.ok("인증 코드가 발송되었습니다.");
    }

    // 인증 코드 검증
    @PostMapping("/email-verification/verify")
    public ResponseEntity<String> verifyCode(@RequestParam String email, @RequestParam String code) {
        boolean isVerified = emailService.verifyCode(email, code);
        return isVerified ? ResponseEntity.ok("인증에 성공했습니다.")
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증 코드가 일치하지 않습니다.");
    }

    // 회원가입 API
    @PostMapping("/signup")
    public ResponseEntity<Long> signup(@RequestBody MemberSignupRequest dto) {
        return ResponseEntity.ok(memberService.signup(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDto dto) {
        String token = memberService.login(dto);
        return ResponseEntity.ok(token);
    }

    @PatchMapping("/me")
    public ResponseEntity<Void> updateProfile(
            @AuthenticationPrincipal String email,
            @RequestBody MemberUpdateRequestDto dto) {

        memberService.updateMyInfo(email, dto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/me/password")
    public ResponseEntity<String> updatePassword(
            @AuthenticationPrincipal String email,
            @RequestBody PasswordUpdateDto dto) {
        try {
            memberService.updatePassword(email, dto);
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String token = resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            memberService.logout(token);
            return ResponseEntity.ok("로그아웃 되었습니다.");
        }

        return ResponseEntity.badRequest().body("유효하지 않은 토큰입니다.");
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    @GetMapping("/me")
    public ResponseEntity<Member> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        Member member = memberService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(member);
    }

    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(memberService.findAll());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}