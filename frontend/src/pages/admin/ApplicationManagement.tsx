import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
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
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredEvents = events.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-application-manage-page">
            <div className="admin-list-header">
                <h1>지원 관리</h1>
            </div>

            <div className="admin-application-toolbar">
                <div className="admin-search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="지원 공고 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="add-btn" onClick={handleAddEvent}>
                    <Plus size={20} /> 새 공고 등록
                </button>
            </div>


            {loading ? (
                <div className="loading-state">데이터를 불러오는 중...</div>
            ) : (
                <div className="admin-application-table-container">
                    <table className="admin-application-table">
                        <thead>
                            <tr>
                                <th>제목</th>
                                <th>활동 분류</th>
                                <th>총 지원자 수</th>
                                <th>모집 상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.map((application) => (
                                <tr key={application.id} className="admin-application-row" onClick={() => navigate(`/admin/applications/${application.id}`)}>
                                    <td className="event-title-cell">
                                        {application.title}
                                    </td>
                                    <td>
                                        <span className={`admin-type-badge ${application.eventType}`}>
                                            {application.eventType === 'RECRUITMENT' ? '정기 모집' : '일반 활동'}
                                        </span>
                                    </td>
                                    <td>{application.applicantCount}명</td>
                                    <td>
                                        <span className={`status-badge ${application.status}`}>
                                            {application.status === 'OPEN' ? '모집 중' : application.status === 'READY' ? '준비 중' : '마감'}
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