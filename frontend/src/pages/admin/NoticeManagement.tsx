import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, Monitor, CheckCircle2, XCircle } from 'lucide-react';
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

    // 1. 공지사항 데이터 불러오기
    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const res = await api.get('/admin/notices');
            setNotices(res.data);
        } catch (err) {
            console.error("공지사항을 불러오지 못했습니다.", err);
        }
    };

    // 2. 홈 슬라이드 노출 상태 변경 (토글)
    const handleSlideToggle = async (id: number, currentStatus: boolean) => {
        try {
            // 백엔드 엔드포인트는 상황에 맞게 수정 (예: PATCH /admin/notices/{id}/slide)
            await api.patch(`/admin/notices/${id}/slide`, { isSlide: !currentStatus });
            setNotices(notices.map(n => n.id === id ? { ...n, isSlide: !currentStatus } : n));
        } catch (err) {
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
                                            onClick={() => handleSlideToggle(notice.id, notice.isSlide)}
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