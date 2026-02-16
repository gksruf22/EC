import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { Users, FileText, Calendar, Clock, ArrowUpRight } from 'lucide-react';
import './Dashboard.css';

interface DashboardStats {
    totalMembers: number;  // changed from totalApplicants
    newApplicantsToday: number;
    ongoingEvents: number;
    upcomingSchedules: number;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats>({
        totalMembers: 0,
        newApplicantsToday: 0,
        ongoingEvents: 0,
        upcomingSchedules: 0
    });
    const [recentApplicants, setRecentApplicants] = useState<any[]>([]);
    const [upcomingList, setUpcomingList] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 병렬 요청으로 데이터 가져오기
                const [eventsRes, schedulesRes, membersRes] = await Promise.all([
                    api.get('/events'),
                    api.get('/schedules'),
                    api.get('/members')
                ]);

                const events = eventsRes.data;
                const schedules = schedulesRes.data;
                const totalMembers = membersRes.data.length;

                // 1. 진행 중인 모집
                const ongoing = events.filter((e: any) => e.status === 'OPEN').length;

                // 2. 예정된 일정
                const today = new Date();
                const upcomingSchedulesFiltered = schedules.filter((s: any) => new Date(s.startDate) > today);
                const upcoming = upcomingSchedulesFiltered.length;

                // 다가오는 일정 리스트 (가까운 날짜순 3개)
                const upcomingTop3 = upcomingSchedulesFiltered
                    .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                    .slice(0, 3);

                setUpcomingList(upcomingTop3);

                // 3. 최근 지원자 (가장 최근 모집 기수 기준)
                const recruitmentEvents = events.filter((e: any) => e.eventType === 'RECRUITMENT');
                let todayApps = 0;
                let recent: any[] = [];

                if (recruitmentEvents.length > 0) {
                    // 가장 최근 기수 찾기 (ID가 크거나 generation이 큰 순)
                    const latestEvent = recruitmentEvents.sort((a: any, b: any) => b.id - a.id)[0];
                    if (latestEvent) {
                        try {
                            const appRes = await api.get(`/admin/applications/generation/${latestEvent.generation}`);
                            const apps = appRes.data;

                            // 오늘 지원자 수
                            const todayStr = new Date().toDateString();
                            todayApps = apps.filter((a: any) => new Date(a.appliedAt).toDateString() === todayStr).length;

                            // 최근 3명
                            recent = apps.slice(0, 3).map((a: any) => ({
                                id: a.id,
                                name: a.name,
                                eventTitle: latestEvent.title, // API 응답에 없으면 이벤트 제목 사용
                                status: a.status,
                                appliedAt: a.appliedAt
                            }));
                        } catch (appErr) {
                            console.error("지원자 데이터 로드 실패:", appErr);
                        }
                    }
                }

                setStats({
                    totalMembers: totalMembers,
                    newApplicantsToday: todayApps,
                    ongoingEvents: ongoing,
                    upcomingSchedules: upcoming
                });
                setRecentApplicants(recent);

            } catch (err) {
                console.error("대시보드 데이터를 불러오는데 실패했습니다.", err);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="dashboard-page">
            {/* 1. 상단 통계 카드 섹션 */}
            <div className="stats-grid">
                <div
                    className="stat-card green"
                    onClick={() => navigate('/admin/members')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="stat-icon"><Users size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">전체 회원수</span>
                        <div className="stat-value-group">
                            <span className="stat-value">{stats.totalMembers}명</span>
                        </div>
                    </div>
                </div>

                <div
                    className="stat-card blue"
                    onClick={() => navigate('/admin/applications')}
                    style={{ cursor: 'pointer' }}>
                    <div className="stat-icon"><FileText size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">진행 중인 모집</span>
                        <div className="stat-value-group">
                            <span className="stat-value">{stats.ongoingEvents}건</span>
                        </div>
                    </div>
                </div>

                <div
                    className="stat-card purple"
                    onClick={() => navigate('/admin/schedules')}
                    style={{ cursor: 'pointer' }}>
                    <div className="stat-icon"><Calendar size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">예정된 일정</span>
                        <div className="stat-value-group">
                            <span className="stat-value">{stats.upcomingSchedules}개</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-main-grid">
                {/* 2. 최근 지원 현황 (테이블) */}
                <div className="dashboard-section recent-applicants">
                    <div className="dashboard-section-header">
                        <h3>최근 지원 현황</h3>
                        <button className="view-all-btn" onClick={() => navigate('/admin/applications')}>전체보기 <ArrowUpRight size={16} /></button>
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
                                {recentApplicants.length === 0 ? (
                                    <tr><td colSpan={4} className="text-center">최근 지원 내역이 없습니다.</td></tr>
                                ) : (
                                    recentApplicants.map((applicant) => (
                                        <tr key={applicant.id}>
                                            <td>{applicant.name}</td>
                                            <td>{applicant.eventTitle}</td>
                                            <td>
                                                <span className={`badge ${applicant.status === 'PENDING' ? 'pending' : (applicant.status === 'PASSED' ? 'passed' : 'failed')}`}>
                                                    {applicant.status === 'PENDING' ? '대기' : (applicant.status === 'PASSED' ? '합격' : '불합격')}
                                                </span>
                                            </td>
                                            <td>{new Date(applicant.appliedAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. 다가오는 일정 요약 */}
                <div className="dashboard-section upcoming-list">
                    <div className="dashboard-section-header">
                        <h3>다가오는 일정</h3>
                    </div>
                    <div className="activity-list">
                        {upcomingList.length === 0 ? (
                            <p className="no-data">예정된 일정이 없습니다.</p>
                        ) : (
                            upcomingList.map((schedule) => (
                                <div className="activity-item" key={schedule.id}>
                                    <div className="activity-date">
                                        {new Date(schedule.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="activity-content">
                                        <p className="activity-title">{schedule.title}</p>
                                        <span className="activity-time">
                                            <Clock size={12} />
                                            {new Date(schedule.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;