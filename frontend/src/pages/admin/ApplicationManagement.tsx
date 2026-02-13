import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileStack, ChevronRight, ClipboardCheck, Info } from 'lucide-react';
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
            // 관리자용 이벤트 목록 API (지원자 수 포함 버전)
            const res = await api.get('/admin/events');
            setEvents(res.data);
        } catch (err) {
            console.error("데이터 로딩 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-manage-page">
            <div className="page-header">
                <div className="header-text">
                    <p className="description">지원자 명단을 확인하려는 모집 항목을 선택하세요.</p>
                </div>
                <div className="info-badge">
                    <Info size={16} />
                    <span>지원자 상태 변경은 명단 상세 보기에서 가능합니다.</span>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">데이터를 불러오는 중...</div>
            ) : (
                <div className="recruitment-grid">
                    {events.map((item) => (
                        <div
                            key={item.id}
                            className={`recruitment-item-card ${item.status}`}
                            onClick={() => navigate(`/admin/applications/${item.id}`)}
                        >
                            <div className="card-top">
                                <span className={`type-tag ${item.eventType}`}>
                                    {item.eventType === 'RECRUITMENT' ? '정기 모집' : '일반 활동'}
                                </span>
                                <span className={`status-pill ${item.status}`}>
                                    {item.status === 'OPEN' ? '모집 중' : item.status === 'READY' ? '준비 중' : '마감'}
                                </span>
                            </div>

                            <div className="card-body">
                                <div className="title-section">
                                    {item.eventType === 'RECRUITMENT' && (
                                        <span className="gen-text">{item.generation}기</span>
                                    )}
                                    <h3 className="event-title">{item.title}</h3>
                                </div>

                                <div className="count-section">
                                    <div className="count-box">
                                        <Users size={20} />
                                        <span className="count-label">총 지원자</span>
                                        <span className="count-number">{item.applicantCount}명</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer">
                                <span className="view-text">명단 자세히 보기</span>
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApplicationManagement;