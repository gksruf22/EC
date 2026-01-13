package com.EC.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MemberSignupRequest {
    private String email;
    private String password;
    private String name;
    private String studentId;
    private String phoneNumber;
}