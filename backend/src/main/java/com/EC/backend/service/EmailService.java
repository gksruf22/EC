package com.EC.backend.service;

import com.EC.backend.repository.MemberRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender emailSender;
    private final StringRedisTemplate redisTemplate;
    private final MemberRepository memberRepository;

    private final long VERIFICATION_LIMIT_TIME = 5 * 60L; // 5분

    public void sendVerificationCode(String email) {
        if(memberRepository.findByEmail(email).isPresent()) {
            throw new IllegalStateException("이미 가입된 이메일입니다.");
        }

        String code = String.valueOf((int)(Math.random() * 899999) + 100000);

        redisTemplate.opsForValue().set(
                "CHECK_CODE:" + email,
                code,
                Duration.ofSeconds(VERIFICATION_LIMIT_TIME)
        );

        sendMail(email, code);
    }

    public boolean verifyCode(String email, String code) {
        String savedCode = redisTemplate.opsForValue().get("CHECK_CODE:" + email);

        if (savedCode == null) {
            throw new IllegalStateException("인증 시간이 만료되었거나 요청 이력이 없습니다.");
        }

        if (savedCode.equals(code)) {
            // 인증 완료 상태를 10분간 유지
            redisTemplate.opsForValue().set(
                    "AUTH_COMPLETE:" + email,
                    "DONE",
                    Duration.ofMinutes(10)
            );
            redisTemplate.delete("CHECK_CODE:" + email);
            return true;
        }
        return false;
    }

    public boolean isVerified(String email) {
        return Boolean.TRUE.equals(redisTemplate.hasKey("AUTH_COMPLETE:" + email));
    }

    private void sendMail(String email, String code) {
        try {
            MimeMessage mimeMessage = emailSender.createMimeMessage();
            // MimeMessageHelper를 사용해 멀티파트 메시지 설정 가능 (UTF-8 지정)
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("EC 회원가입 인증번호 안내");

            // HTML 형식의 메일 본문 작성
            String htmlContent =
                    "<div style='background-color: #f4f4f4; padding: 40px; font-family: Arial, sans-serif;'>" +
                            "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; shadow: 0 4px 6px rgba(0,0,0,0.1);'>" +
                            "<h2 style='color: #2D3E50; text-align: center;'>EC 회원가입 인증번호</h2>" +
                            "<p style='font-size: 16px; color: #555; text-align: center'>아래 인증 번호를 입력하여 가입 절차를 완료해 주세요.</p>" +
                            "<div style='margin: 30px 0; padding: 20px; background-color: #F8F9FA; border-radius: 4px; text-align: center;'>" +
                            "<span style='font-size: 32px; font-weight: bold; color: rgba(90, 160, 90); letter-spacing: 5px;'>" + code + "</span>" +
                            "</div>" +
                            "<p style='font-size: 14px; color: #FF4D4F; text-align: center;'>* 이 인증 번호는 5분 동안 유효합니다.</p>" +
                            "<hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>" +
                            "<p style='font-size: 12px; color: #999; text-align: center;'>본 메일은 발신 전용입니다. 문의 사항은 동아리 관리자에게 연락해 주세요.</p>" +
                            "</div>" +
                            "</div>";

            // true를 전달해야 HTML로 렌더링됩니다.
            helper.setText(htmlContent, true);

            emailSender.send(mimeMessage);
        } catch (MessagingException e) {
            // 예외 발생 시 구체적인 에러 메시지 확인 가능
            throw new RuntimeException("메일 전송 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}