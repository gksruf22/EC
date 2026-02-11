package com.EC.backend.dto;

import com.EC.backend.domain.Member;
import com.EC.backend.domain.Role;
import lombok.Getter;

@Getter
public class MemberResponseDto {
    private Long id;
    private String email;
    private String name;
    private String studentId;
    private String phoneNumber;
    private Role role;

    public MemberResponseDto(Member member) {
        this.id = member.getId();
        this.email = member.getEmail();
        this.name = member.getName();
        this.studentId = member.getStudentId();
        this.phoneNumber = member.getPhoneNumber();
        this.role = member.getRole();
    }
}