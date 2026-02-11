package com.EC.backend.controller;

import com.EC.backend.domain.Role;
import com.EC.backend.dto.MemberResponseDto;
import com.EC.backend.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/members")
public class AdminMemberController {

    private final MemberService memberService;

    // 모든 회원 목록 조회
    @GetMapping
    public ResponseEntity<List<MemberResponseDto>> getAllMembers() {
        return ResponseEntity.ok(memberService.findAllMembers());
    }

    // 회원 권한 변경
    @PatchMapping("/{id}/role")
    public ResponseEntity<Void> updateMemberRole(
            @PathVariable Long id,
            @RequestParam Role role) {
        memberService.updateRole(id, role);
        return ResponseEntity.ok().build();
    }

    // 회원 삭제 (강제 탈퇴)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> kickMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.ok().build();
    }
}