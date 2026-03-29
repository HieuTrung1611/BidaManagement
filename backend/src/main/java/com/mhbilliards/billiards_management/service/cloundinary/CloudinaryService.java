package com.mhbilliards.billiards_management.service.cloundinary;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {
    @Autowired
    private Cloudinary cloudinary;

    // Phương thức tải file lên Cloudinary với optimization
    @SuppressWarnings("unchecked")
    public Map<String, Object> uploadFile(MultipartFile file) throws IOException {
        try {
            // Thêm các options để optimize upload
            Map<String, Object> options = new HashMap<>();
            // Folder lưu ảnh
            options.put("folder", "MHBilliards");

            // Resize nếu ảnh quá lớn (max width 1920px)
            options.put("width", 1920);
            options.put("crop", "limit");

            // Tự động optimize chất lượng
            options.put("quality", "auto:good");
            options.put("fetch_format", "auto");

            // Upload với timeout 60s
            options.put("timeout", 60000);

            // Sử dụng phương thức upload của Cloudinary
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

            // Trả về kết quả upload, bao gồm URL của file đã tải lên
            return uploadResult;

        } catch (IOException e) {
            // Xử lý lỗi tải file
            throw new IOException("Failed to upload file to Cloudinary: " + e.getMessage(), e);
        }
    }

    // Phương thức xóa file (tùy chọn)
    @SuppressWarnings("unchecked")
    public Map<String, Object> deleteFile(String publicId) throws IOException {
        try {
            // publicId là định danh của file trên Cloudinary
            return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new IOException("Failed to delete file from Cloudinary", e);
        }
    }
}
