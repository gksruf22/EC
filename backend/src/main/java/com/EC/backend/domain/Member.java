package com.EC.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;    // @seoultech.ac.kr 이메일

    @Column(nullable = false)
    private String password; // 암호화된 비밀번호

    private String name;
    private String studentId;
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.ROLE_USER;

    public void updateInfo(String name, String phoneNumber) {
        if (name != null && !name.isEmpty()) {
            this.name = name;
        }
        if (phoneNumber != null && !phoneNumber.isEmpty()) {
            this.phoneNumber = phoneNumber;
        }
    }

    public void updatePassword(String encodedPassword) {
        this.password = encodedPassword;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
