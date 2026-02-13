import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    Phone,
    Hash,
    FileText,
    CheckCircle,
    XCircle,
    RotateCcw,
    Calendar,
    Info
} from 'lucide-react';
import api from '../../utils/api';
import './ApplicationDetail.css';

interface ApplicantDetailData {
    id: number;
    name: string;
    studentId: string;
    phoneNumber: string;
    status: 'PENDING' | 'PASSED' | 'FAILED';
    motive: string;
    experience: string;
    appliedAt: string;
    eventType: 'RECRUITMENT' | 'GENERAL';
    eventTitle: string;
}

const ApplicantDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [applicant, setApplicant] = useState<ApplicantDetailData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplicantDetail();
    }, [id]);

    const fetchApplicantDetail = async () => {
        try {
            const res = await api.get(`/admin/applications/${id}`);
            setApplicant(res.data);
        } catch (err) {
            console.error("상세 정보 로드 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: 'PASSED' | 'FAILED' | 'PENDING') => {
        const statusText = newStatus === 'PASSED' ? '합격' : newStatus === 'FAILED' ? '불합격' : '대기';
        if (!window.confirm(`이 지원자를 [${statusText}] 상태로 변경하시겠습니까?`)) return;

        try {
            await api.patch(`/admin/applications/${id}/status`, { status: newStatus });
            setApplicant(prev => prev ? { ...prev, status: newStatus } : null);
            alert('상태가 변경되었습니다.');
        } catch (err) {
            alert('상태 변경 중 오류가 발생했습니다.');
        }
    };

    if (loading) return <div className="loading">데이터를 불러오는 중...</div>;
    if (!applicant) return <div className="error">지원자 정보를 찾을 수 없습니다.</div>;

    return (
        <div className="applicant-detail-page">
            {/* 상단 헤더 */}
            <div className="detail-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> 이전으로
                </button>
                <div className="status-indicator">
                    <span className={`status-dot ${applicant.status}`}></span>
                    <span className="status-text">현재 상태: {applicant.status}</span>
                </div>
            </div>

            <div className="detail-grid">
                {/* 왼쪽: 기본 정보 카드 */}
                <div className="info-side">
                    <div className="detail-card profile-card">
                        <div className="profile-avatar">{applicant.name[0]}</div>
                        <h2 className="profile-name">{applicant.name}</h2>
                        <p className="applied-event-name">{applicant.eventTitle}</p>

                        <div className="quick-info">
                            <div className="info-row">
                                <Hash size={16} /> <span>{applicant.studentId}</span>
                            </div>
                            <div className="info-row">
                                <Phone size={16} /> <span>{applicant.phoneNumber}</span>
                            </div>
                            <div className="info-row">
                                <Calendar size={16} /> <span>{new Date(applicant.appliedAt).toLocaleDateString()} 지원</span>
                            </div>
                        </div>

                        <div className="status-control">
                            <p className="control-label">지원 상태 변경</p>
                            <div className="btn-group">
                                <button
                                    className={`action-btn pass ${applicant.status === 'PASSED' ? 'active' : ''}`}
                                    onClick={() => handleStatusChange('PASSED')}
                                >
                                    <CheckCircle size={18} /> 합격 처리
                                </button>
                                <button
                                    className={`action-btn fail ${applicant.status === 'FAILED' ? 'active' : ''}`}
                                    onClick={() => handleStatusChange('FAILED')}
                                >
                                    <XCircle size={18} /> 불합격 처리
                                </button>
                                <button
                                    className="action-btn reset"
                                    onClick={() => handleStatusChange('PENDING')}
                                >
                                    <RotateCcw size={18} /> 대기 전환
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 오른쪽: 지원서 내용 (정기 모집인 경우에만 강조 표시) */}
                <div className="content-side">
                    {applicant.eventType === 'RECRUITMENT' ? (
                        <>
                            <div className="detail-card content-card">
                                <div className="card-header">
                                    <FileText size={20} /> <h3>지원 동기</h3>
                                </div>
                                <div className="content-text">{applicant.motive}</div>
                            </div>

                            <div className="detail-card content-card">
                                <div className="card-header">
                                    <FileText size={20} /> <h3>관련 경험</h3>
                                </div>
                                <div className="content-text">{applicant.experience}</div>
                            </div>
                        </>
                    ) : (
                        <div className="detail-card content-card empty">
                            <div className="empty-state">
                                <Info size={40} />
                                <p>일반 활동 지원 항목입니다.<br />별도의 지원서 내용이 없습니다.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicantDetail;