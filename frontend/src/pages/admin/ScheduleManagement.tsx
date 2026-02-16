import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import api from '../../utils/api';
import './ScheduleManagement.css';

interface Schedule {
    id: number;
    title: string;
    startDateTime: string;
    endDateTime: string;
    relatedLink?: string;
}

const ScheduleManagement: React.FC = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // 새 일정 입력을 위한 상태
    const [newSchedule, setNewSchedule] = useState({
        title: '',
        startDateTime: '',
        endDateTime: '',
        relatedLink: ''
    });
    const [isTimeSpecified, setIsTimeSpecified] = useState(false);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const res = await api.get('/schedules');
            setSchedules(res.data);
        } catch (err) {
            console.error("일정을 불러오는데 실패했습니다.", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let finalStart = newSchedule.startDateTime;
            let finalEnd = newSchedule.endDateTime;

            if (!isTimeSpecified) {
                // 시간 미지정 시: 시작일 00:00, 종료일 23:59
                finalStart = `${finalStart}T00:00:00`;
                finalEnd = `${finalEnd}T23:59:59`;
            }

            await api.post('/admin/schedules', {
                ...newSchedule,
                startDateTime: finalStart,
                endDateTime: finalEnd
            });
            setIsModalOpen(false);
            setNewSchedule({ title: '', startDateTime: '', endDateTime: '', relatedLink: '' });
            setIsTimeSpecified(false);
            fetchSchedules(); // 목록 새로고침
        } catch (err) {
            console.error(err);
            alert("일정 등록에 실패했습니다.");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("이 일정을 삭제하시겠습니까?")) {
            try {
                await api.delete(`/admin/schedules/${id}`);
                fetchSchedules();
            } catch (err) {
                alert("삭제 실패");
            }
        }
    };

    const filteredSchedules = schedules.filter(schedule =>
        schedule.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-schedule-manage-page">
            <div className="admin-list-header">
                <h1>일정 관리</h1>
            </div>

            <div className="admin-schedule-toolbar">
                <div className="admin-search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="일정명 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="add-btn" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> 일정 추가
                </button>
            </div>

            <div className="admin-schedule-table-container">
                <table className="admin-schedule-table">
                    <thead>
                        <tr>
                            <th>일정명</th>
                            <th>기간</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSchedules.length === 0 ? (
                            <tr><td colSpan={3} className="no-data">등록된 일정이 없습니다.</td></tr>
                        ) : (
                            filteredSchedules.map((item) => (
                                <tr key={item.id}>
                                    <td className="schedule-title">
                                        {item.title}
                                        {item.relatedLink && (
                                            <a href={item.relatedLink} target="_blank" rel="noopener noreferrer" className="link-icon">
                                                🔗
                                            </a>
                                        )}
                                    </td>
                                    <td className="schedule-date">
                                        {new Date(item.startDateTime).toLocaleString()} ~ {new Date(item.endDateTime).toLocaleString()}
                                    </td>
                                    <td className="actions text-center">
                                        <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 일정 추가 모달 */}
            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>새 일정 등록</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>일정 제목</label>
                                <input
                                    type="text"
                                    required
                                    value={newSchedule.title}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                                    placeholder="예: 36기 서류 접수"
                                />
                            </div>

                            <div className="input-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={isTimeSpecified}
                                        onChange={(e) => setIsTimeSpecified(e.target.checked)}
                                    />
                                    시간 지정
                                </label>
                            </div>

                            <div className="input-row">
                                <div className="input-group">
                                    <label>시작 {isTimeSpecified ? '일시' : '날짜'}</label>
                                    <input
                                        type={isTimeSpecified ? "datetime-local" : "date"}
                                        required
                                        value={newSchedule.startDateTime}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, startDateTime: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>종료 {isTimeSpecified ? '일시' : '날짜'}</label>
                                    <input
                                        type={isTimeSpecified ? "datetime-local" : "date"}
                                        required
                                        value={newSchedule.endDateTime}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, endDateTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>관련 링크 (선택)</label>
                                <input
                                    type="url"
                                    value={newSchedule.relatedLink}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, relatedLink: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>취소</button>
                                <button type="submit" className="confirm-btn">등록하기</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleManagement;