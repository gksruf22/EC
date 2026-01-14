package com.EC.backend.repository;

import com.EC.backend.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);
    Optional<Member> findByNameAndStudentId(String name, String studentId);
    boolean existsByEmail(String email);
}