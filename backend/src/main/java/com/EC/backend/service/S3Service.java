package com.EC.backend.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
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

    private String sanitize(String filename) {
        return filename == null ? "file" : filename.replaceAll("[^A-Za-z0-9._-]", "_");
    }

    public String uploadFile(MultipartFile file, String folderName) throws IOException {
        // 1. 파일명 및 폴더명 정규화
        String safeFolderName = folderName.replaceAll("[^A-Za-z0-9._-]", "_");
        String safeFileName = UUID.randomUUID() + "_" + file.getOriginalFilename().replaceAll("[^A-Za-z0-9._-]", "_");
        String fullPath = safeFolderName + "/" + safeFileName;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        // 2. S3 업로드 (ACL 설정 제거 - 버킷 정책 설정 따름)
        amazonS3.putObject(new PutObjectRequest(bucket, fullPath, file.getInputStream(), metadata));

        return amazonS3.getUrl(bucket, fullPath).toString();
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