package com.EC.backend.repository;

import com.EC.backend.domain.HomeSlide;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HomeSlideRepository extends JpaRepository<HomeSlide, Long> {
    List<HomeSlide> findAllByOrderBySequenceAsc();
}