package com.EC.backend.repository;

import com.EC.backend.domain.Application;
import com.EC.backend.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    Optional<Application> findByMember(Member member);

    boolean existsByMember(Member member);
}