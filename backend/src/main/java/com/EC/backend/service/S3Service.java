package com.EC.backend.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String uploadFile(MultipartFile file, String folderName) throws IOException {
        // 파일명 중복 방지를 위한 UUID 생성
        String fileName = folderName + "/" + UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        // S3에 전송할 메타데이터 설정
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        // S3로 파일 업로드
        amazonS3.putObject(bucket, fileName, file.getInputStream(), metadata);

        // 업로드된 파일의 공개 URL 반환
        return amazonS3.getUrl(bucket, fileName).toString();
    }

    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) return;

        try {
            // URL에서 "folder/uuid_file.jpg" 부분만 추출
            // URL 예시: https://ec-image-storage-2026.s3.ap-northeast-2.amazonaws.com/notice/abc-123.jpg
            // .com/ 뒷부분을 가져오면 됩니다.
            java.net.URL url = new java.net.URL(fileUrl);
            String key = url.getPath().substring(1);

            // S3에서 해당 키(Key)를 가진 객체 삭제
            amazonS3.deleteObject(new com.amazonaws.services.s3.model.DeleteObjectRequest(bucket, key));
            System.out.println("S3 파일 삭제 성공: " + key);
        } catch (Exception e) {
            System.err.println("S3 파일 삭제 실패: " + e.getMessage());
        }
    }
}