import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, Monitor } from 'lucide-react';
import api from '../../utils/api';
import './NoticeManagement.css';

interface Notice {
    id: number;
    title: string;
    createdAt: string;
    isSlide: boolean; // 홈 화면 슬라이드 노출 여부
    author: string;
}

const NoticeManagement: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // 1. 공지사항 & 슬라이드 데이터 불러오기
    useEffect(() => {
        fetchNoticesAndSlides();
    }, []);

    const fetchNoticesAndSlides = async () => {
        try {
            const [noticesRes, slidesRes] = await Promise.all([
                api.get('/notices'), // 공개된 공지사항 목록
                api.get('/slides')   // 홈 슬라이드 목록
            ]);

            const fetchedNotices: Notice[] = noticesRes.data;
            const slides: any[] = slidesRes.data;

            // 슬라이드에 등록된 공지사항인지 확인하여 매핑
            const noticesWithSlideStatus = fetchedNotices.map((notice) => {
                const relatedSlide = slides.find(s => s.linkUrl && s.linkUrl.includes(`/notice/${notice.id}`));
                return {
                    ...notice,
                    isSlide: !!relatedSlide,
                    slideId: relatedSlide ? relatedSlide.id : undefined // 슬라이드 ID 저장 (삭제 등을 위해)
                };
            });

            setNotices(noticesWithSlideStatus);
        } catch (err) {
            console.error("데이터를 불러오지 못했습니다.", err);
        }
    };

    // 2. 홈 슬라이드 노출 상태 변경 (토글)
    const handleSlideToggle = async (notice: Notice & { slideId?: number }) => {
        const currentStatus = notice.isSlide;

        try {
            if (currentStatus) {
                // 슬라이드 해제 (HomeSlide 삭제)
                if (notice.slideId) {
                    await api.delete(`/admin/slides/${notice.slideId}`);
                }
            } else {
                // 슬라이드 등록 (HomeSlide 생성)
                await api.post('/admin/slides', {
                    title: notice.title,
                    imageUrl: "https://via.placeholder.com/800x400", // 임시 이미지 (실제로는 공지사항 이미지나 기본 이미지 사용)
                    linkUrl: `/notice/${notice.id}`,
                    sequence: 0
                });
            }
            // 목록 새로고침
            fetchNoticesAndSlides();
        } catch (err) {
            console.error(err);
            alert("슬라이드 상태 변경에 실패했습니다.");
        }
    };

    // 3. 공지사항 삭제
    const handleDelete = async (id: number) => {
        if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
            try {
                await api.delete(`/admin/notices/${id}`);
                setNotices(notices.filter(n => n.id !== id));
            } catch (err) {
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="notice-manage-page">
            <div className="page-header">
                <div className="search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="공지사항 제목 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="add-btn" onClick={() => alert('공지사항 작성 페이지로 이동')}>
                    <Plus size={20} /> 새 공지 등록
                </button>
            </div>

            <div className="notice-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>슬라이드</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>작성일</th>
                            <th className="text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notices
                            .filter(n => n.title.includes(searchTerm))
                            .map((notice) => (
                                <tr key={notice.id}>
                                    <td>{notice.id}</td>
                                    <td>
                                        {/* 슬라이드 스위치 */}
                                        <button
                                            className={`slide-toggle ${notice.isSlide ? 'on' : 'off'}`}
                                            onClick={() => handleSlideToggle(notice)}
                                            title={notice.isSlide ? "슬라이드 해제" : "슬라이드 등록"}
                                        >
                                            <Monitor size={16} />
                                            <span>{notice.isSlide ? '노출 중' : '미노출'}</span>
                                        </button>
                                    </td>
                                    <td className="notice-title">{notice.title}</td>
                                    <td>{notice.author}</td>
                                    <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
                                    <td className="actions text-center">
                                        <button className="icon-btn edit" title="수정"><Edit2 size={16} /></button>
                                        <button className="icon-btn delete" title="삭제" onClick={() => handleDelete(notice.id)}><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NoticeManagement;