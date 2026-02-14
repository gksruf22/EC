import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import api from '../../utils/api';
import './ApplicationManagement.css';

interface RecruitmentSummary {
    id: number;
    title: string;
    generation: number;
    eventType: 'RECRUITMENT' | 'GENERAL';
    status: 'READY' | 'OPEN' | 'CLOSED';
    applicantCount: number;
}

const ApplicationManagement: React.FC = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<RecruitmentSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecruitments();
    }, []);

    const fetchRecruitments = async () => {
        try {
            // 관리자용 이벤트 목록 API (현재는 일반 이벤트 목록 사용)
            const res = await api.get('/events');
            setEvents(res.data);
        } catch (err) {
            console.error("데이터 로딩 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    // 공고 등록 페이지로 이동
    const handleAddEvent = () => {
        navigate('/admin/applications/new');
    };

    return (
        <div className="app-manage-page">
            <div className="page-header">
                <div className="header-text">
                    <p className="description">지원자 명단을 확인하려는 모집 항목을 선택하세요.</p>
                </div>
                <button className="add-event-btn" onClick={handleAddEvent}>
                    <Plus size={18} /> 공고 등록
                </button>
            </div>

            {loading ? (
                <div className="loading-state">데이터를 불러오는 중...</div>
            ) : (
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>제목</th>
                                <th>활동 분류</th>
                                <th>총 지원자 수</th>
                                <th>모집 상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((item) => (
                                <tr key={item.id} className="cursor-pointer" onClick={() => navigate(`/admin/applications/${item.id}`)}>
                                    <td className="event-title-cell">
                                        {item.title}
                                    </td>
                                    <td>
                                        <span className={`admin-type-badge ${item.eventType}`}>
                                            {item.eventType === 'RECRUITMENT' ? '정기 모집' : '일반 활동'}
                                        </span>
                                    </td>
                                    <td>{item.applicantCount}명</td>
                                    <td>
                                        <span className={`status-badge ${item.status}`}>
                                            {item.status === 'OPEN' ? '모집 중' : item.status === 'READY' ? '준비 중' : '마감'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ApplicationManagement;