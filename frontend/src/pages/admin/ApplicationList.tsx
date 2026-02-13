import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, FileDown, ExternalLink, UserCheck, UserX, Clock } from 'lucide-react';
import api from '../../utils/api';
import './ApplicationList.css';

interface Applicant {
    id: number;
    name: string;
    studentId: string;
    status: 'PENDING' | 'PASSED' | 'FAILED';
    appliedAt: string;
}

const ApplicantList: React.FC = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [eventTitle, setEventTitle] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, [eventId]);

    const fetchData = async () => {
        try {
            // 1. 이벤트 정보 가져오기 (제목 표시용)
            const eventRes = await api.get(`/admin/events/${eventId}`);
            setEventTitle(eventRes.data.title);

            // 2. 지원자 명단 가져오기
            const applicantRes = await api.get(`/admin/events/${eventId}/applicants`);
            setApplicants(applicantRes.data);
        } catch (err) {
            console.error("데이터 로드 실패:", err);
        }
    };

    // CSV 내보내기 (간이 기능)
    const exportToCSV = () => {
        alert("엑셀 추출 기능을 준비 중입니다.");
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

            <div className="table-container">
                <table className="applicant-table">
                    <thead>
                        <tr>
                            <th>이름</th>
                            <th>학번</th>
                            <th>지원 일시</th>
                            <th>상태</th>
                            <th className="text-center">상세보기</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplicants.length === 0 ? (
                            <tr><td colSpan={5} className="no-results">조건에 맞는 지원자가 없습니다.</td></tr>
                        ) : (
                            filteredApplicants.map((ap) => (
                                <tr key={ap.id}>
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
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <button
                                            className="detail-link-btn"
                                            onClick={() => navigate(`/admin/applications/detail/${ap.id}`)}
                                        >
                                            상세 정보 <ExternalLink size={14} />
                                        </button>
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