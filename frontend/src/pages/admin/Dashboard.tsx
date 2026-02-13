import React, { useState, useEffect } from 'react';
import { Users, FileText, Calendar, Clock, ArrowUpRight } from 'lucide-react';
import './Dashboard.css';

interface DashboardStats {
    totalApplicants: number;
    newApplicantsToday: number;
    ongoingEvents: number;
    upcomingSchedules: number;
}

const Dashboard: React.FC = () => {
    // 실제로는 API에서 가져올 데이터 (현재는 초기값/더미)
    const [stats, setStats] = useState<DashboardStats>({
        totalApplicants: 42,
        newApplicantsToday: 5,
        ongoingEvents: 2,
        upcomingSchedules: 3
    });

    return (
        <div className="dashboard-page">
            {/* 1. 상단 통계 카드 섹션 */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><Users size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">전체 지원자</span>
                        <div className="stat-value-group">
                            <span className="stat-value">{stats.totalApplicants}명</span>
                            <span className="stat-change">+{stats.newApplicantsToday} today</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card green">
                    <div className="stat-icon"><FileText size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">진행 중인 모집</span>
                        <span className="stat-value">{stats.ongoingEvents}건</span>
                    </div>
                </div>

                <div className="stat-card purple">
                    <div className="stat-icon"><Calendar size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">예정된 일정</span>
                        <span className="stat-value">{stats.upcomingSchedules}개</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-main-grid">
                {/* 2. 최근 지원 현황 (테이블) */}
                <div className="dashboard-section recent-applicants">
                    <div className="section-header">
                        <h3>최근 지원 현황</h3>
                        <button className="view-all-btn">전체보기 <ArrowUpRight size={16} /></button>
                    </div>
                    <div className="table-wrapper">
                        <table className="summary-table">
                            <thead>
                                <tr>
                                    <th>이름</th>
                                    <th>지원 항목</th>
                                    <th>상태</th>
                                    <th>시간</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>조한결</td>
                                    <td>36기 정기 모집</td>
                                    <td><span className="badge pending">대기</span></td>
                                    <td>2시간 전</td>
                                </tr>
                                <tr>
                                    <td>김철수</td>
                                    <td>36기 정기 모집</td>
                                    <td><span className="badge passed">합격</span></td>
                                    <td>5시간 전</td>
                                </tr>
                                <tr>
                                    <td>이영희</td>
                                    <td>개강 파티</td>
                                    <td><span className="badge pending">대기</span></td>
                                    <td>어제</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. 다가오는 일정 요약 */}
                <div className="dashboard-section upcoming-list">
                    <div className="section-header">
                        <h3>다가오는 일정</h3>
                    </div>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-date">Feb 20</div>
                            <div className="activity-content">
                                <p className="activity-title">36기 서류 마감</p>
                                <span className="activity-time"><Clock size={12} /> 23:59</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-date">Feb 22</div>
                            <div className="activity-content">
                                <p className="activity-title">개강 파티</p>
                                <span className="activity-time"><Clock size={12} /> 18:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;