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
    private final S3Service s3Service;

    @Transactional
    public Long createNotice(NoticeRequestDto dto, String email) {
        Member author = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Notice notice = Notice.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .imageUrl(dto.getImageUrl())
                .author(author)
                .createdAt(java.time.LocalDateTime.now())
                .build();

        return noticeRepository.save(notice).getId();
    }

    @Transactional
    public void updateNotice(Long id, NoticeRequestDto dto) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 공지사항을 찾을 수 없습니다."));

        // 엔티티 내부의 update 메서드 호출
        notice.update(dto.getTitle(), dto.getContent(), dto.getImageUrl());
    }

    @Transactional
    public void deleteNotice(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 공지사항을 찾을 수 없습니다."));

        if (notice.getImageUrl() != null) {
            s3Service.deleteFile(notice.getImageUrl());
        }

        noticeRepository.delete(notice);
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