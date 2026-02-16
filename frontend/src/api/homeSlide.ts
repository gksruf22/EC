import api from '../utils/api';

export interface HomeSlide {
    id: number;
    imageUrl: string;
    title: string;
    linkUrl: string;
    sequence: number;
}

export interface CreateHomeSlideRequest {
    imageUrl: string;
    title: string;
    linkUrl: string;
    sequence: number;
}

/**
 * 모든 슬라이드를 가져옵니다.
 */
export const getSlides = async (): Promise<HomeSlide[]> => {
    const response = await api.get<HomeSlide[]>('/slides');
    return response.data;
};

/**
 * 새 슬라이드를 생성합니다.
 */
export const createSlide = async (data: CreateHomeSlideRequest): Promise<number> => {
    const response = await api.post<number>('/admin/slides', data);
    return response.data;
};

/**
 * 슬라이드를 삭제합니다.
 */
export const deleteSlide = async (id: number): Promise<void> => {
    await api.delete(`/admin/slides/${id}`);
};

/**
 * 슬라이드를 수정합니다.
 */
export const updateSlide = async (id: number, data: CreateHomeSlideRequest): Promise<number> => {
    const response = await api.put<number>(`/admin/slides/${id}`, data);
    return response.data;
};

/**
 * 슬라이드 순서를 일괄 수정합니다.
 */
export const updateSlideSequences = async (items: { id: number; sequence: number }[]): Promise<void> => {
    await api.patch('/admin/slides/sequence', items);
};
