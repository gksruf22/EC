import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, FileDown, UserCheck, UserX, Clock, Edit } from 'lucide-react';
import api from '../../utils/api';
import './ApplicationList.css';

interface Applicant {
    id: number;
    name: string;
    studentId: string;
    status: 'PENDING' | 'PASSED' | 'FAILED' | 'APPROVED';
    appliedAt: string;
}

const ApplicantList: React.FC = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [eventTitle, setEventTitle] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isRecruitment, setIsRecruitment] = useState(false);

    useEffect(() => {
        fetchData();
    }, [eventId]);

    const fetchData = async () => {
        try {
            if (!eventId) return;

            // 1. 이벤트 정보 가져오기 (제목 및 기수 확인용)
            // 관리자용 이벤트 상세가 없으므로 일반 이벤트 API 사용
            const eventRes = await api.get(`/events/${eventId}`);
            const eventData = eventRes.data;
            setEventTitle(eventData.title);
            setIsRecruitment(eventData.eventType === 'RECRUITMENT');

            // 2. 해당 기수의 지원자 명단 가져오기
            // 백엔드는 기수 단위로 지원자를 반환하므로, 가져온 후 eventId로 필터링해야 함
            const generation = eventData.generation;
            const applicantRes = await api.get(`/admin/applications/generation/${generation}`);

            // 3. 현재 이벤트에 해당하는 지원자만 필터링 및 데이터 매핑
            const mappedApplicants = applicantRes.data
                .filter((app: any) => app.eventId === Number(eventId))
                .map((app: any) => ({
                    id: app.id,
                    name: app.name,
                    studentId: app.studentId,
                    // 백엔드 status (PENDING, APPROVED, REJECTED, PASSED) -> 프론트 status 매핑
                    status: app.status === 'REJECTED' ? 'FAILED' : app.status,
                    appliedAt: app.appliedAt
                }));

            setApplicants(mappedApplicants);
        } catch (err) {
            console.error("데이터 로드 실패:", err);
        }
    };

    // CSV 내보내기 (간이 기능)
    const exportToCSV = () => {
        alert("엑셀 추출 기능을 준비 중입니다.");
    };

    // 공고 수정 페이지로 이동
    const handleEditEvent = () => {
        if (eventId) {
            navigate(`/admin/applications/edit/${eventId}`);
        }
    };

    const filteredApplicants = applicants.filter(ap =>
        ap.name.includes(searchTerm) || ap.studentId.includes(searchTerm)
    );

    return (
        <div className="applicant-list-page">
            <div className="list-header">
                <button className="back-link" onClick={() => navigate('/admin/applications')}>
                    <ArrowLeft size={18} /> 모집 목록으로
                </button>
                <div className="title-area">
                    <h1>{eventTitle} <span className="count">({applicants.length}명)</span></h1>
                    <button className="edit-event-btn" onClick={handleEditEvent} title="공고 수정">
                        <Edit size={18} />
                    </button>
                </div>
            </div>

            <div className="list-toolbar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="이름 또는 학번 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="export-btn" onClick={exportToCSV}>
                    <FileDown size={18} /> 명단 내보내기
                </button>
            </div>

            <div className="admin-application-table-container">
                <table className="admin-application-table">
                    <thead>
                        <tr>
                            <th>이름</th>
                            <th>학번</th>
                            <th>지원 일시</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplicants.length === 0 ? (
                            <tr><td colSpan={4} className="no-results">조건에 맞는 지원자가 없습니다.</td></tr>
                        ) : (
                            filteredApplicants.map((ap) => (
                                <tr
                                    key={ap.id}
                                    className={isRecruitment ? "admin-application-row" : ""}
                                    onClick={() => isRecruitment && navigate(`/admin/applications/detail/${ap.id}`)}
                                >
                                    <td className="user-name">{ap.name}</td>
                                    <td className="user-id">{ap.studentId}</td>
                                    <td className="applied-at">
                                        <Clock size={14} /> {new Date(ap.appliedAt).toLocaleString('ko-KR')}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${ap.status}`}>
                                            {ap.status === 'PENDING' && <><Clock size={12} /> 대기</>}
                                            {ap.status === 'PASSED' && <><UserCheck size={12} /> 합격</>}
                                            {ap.status === 'FAILED' && <><UserX size={12} /> 불합격</>}
                                            {ap.status === 'APPROVED' && <><FileDown size={12} /> 서류 합격</>}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApplicantList;