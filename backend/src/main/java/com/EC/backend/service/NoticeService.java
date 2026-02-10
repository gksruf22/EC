package com.EC.backend.service;

import com.EC.backend.domain.Member;
import com.EC.backend.domain.Notice;
import com.EC.backend.dto.NoticeRequestDto;
import com.EC.backend.dto.NoticeResponseDto;
import com.EC.backend.repository.MemberRepository;
import com.EC.backend.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public Long createNotice(NoticeRequestDto dto, String email) {
        Member author = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Notice notice = new Notice(dto.title(), dto.content(), author);
        return noticeRepository.save(notice).getId();
    }

    public List<NoticeResponseDto> findAllNotices() {
        return noticeRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(NoticeResponseDto::new)
                .collect(Collectors.toList());
    }

    public NoticeResponseDto findById(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 공지사항을 찾을 수 없습니다."));
        return new NoticeResponseDto(notice);
    }
}