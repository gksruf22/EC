package com.EC.backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberSignupRequest {
    private String email;
    private String password;
    private String name;
    private String studentId;
    private String phoneNumber;
}