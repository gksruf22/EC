import api from '../utils/api';

/**
 * 이미지를 업로드하고 URL을 반환합니다.
 * @param file 업로드할 이미지 파일
 * @param folder 저장할 폴더명 (기본값: 'slides')
 * @returns 업로드된 이미지의 URL
 */
export const uploadImage = async (file: File, folder: string = 'slides'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await api.post('/admin/images/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data; // URL string
};

/**
 * 이미지 URL을 통해 이미지를 삭제합니다.
 * @param url 삭제할 이미지 URL
 */
export const deleteImage = async (url: string): Promise<void> => {
    await api.delete(`/admin/images/delete`, {
        params: { url }
    });
};
