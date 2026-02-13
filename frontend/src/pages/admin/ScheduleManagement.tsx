import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, Clock, Tag } from 'lucide-react';
import api from '../../utils/api';
import './ScheduleManagement.css';

interface Schedule {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    category: string; // 예: '정기모집', '세미나', '행사' 등
}

const ScheduleManagement: React.FC = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 새 일정 입력을 위한 상태
    const [newSchedule, setNewSchedule] = useState({
        title: '',
        startDate: '',
        endDate: '',
        category: '정기모집'
    });

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const res = await api.get('/admin/schedules');
            setSchedules(res.data);
        } catch (err) {
            console.error("일정을 불러오는데 실패했습니다.", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/admin/schedules', newSchedule);
            setIsModalOpen(false);
            setNewSchedule({ title: '', startDate: '', endDate: '', category: '정기모집' });
            fetchSchedules(); // 목록 새로고침
        } catch (err) {
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

    return (
        <div className="schedule-manage-page">
            <div className="page-header">
                <p className="description">메인 화면 달력에 표시될 일정을 관리합니다.</p>
                <button className="add-schedule-btn" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> 일정 추가
                </button>
            </div>

            <div className="schedule-list-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>카테고리</th>
                            <th>일정명</th>
                            <th>기간</th>
                            <th className="text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.length === 0 ? (
                            <tr><td colSpan={4} className="no-data">등록된 일정이 없습니다.</td></tr>
                        ) : (
                            schedules.map((item) => (
                                <tr key={item.id}>
                                    <td><span className={`cat-tag ${item.category}`}>{item.category}</span></td>
                                    <td className="schedule-title">{item.title}</td>
                                    <td className="schedule-date">
                                        <Clock size={14} /> {item.startDate} ~ {item.endDate}
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
                            <div className="input-row">
                                <div className="input-group">
                                    <label>시작 날짜</label>
                                    <input
                                        type="date"
                                        required
                                        value={newSchedule.startDate}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>종료 날짜</label>
                                    <input
                                        type="date"
                                        required
                                        value={newSchedule.endDate}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>카테고리</label>
                                <select
                                    value={newSchedule.category}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, category: e.target.value })}
                                >
                                    <option value="정기모집">정기모집</option>
                                    <option value="세미나">세미나</option>
                                    <option value="행사">행사</option>
                                    <option value="기타">기타</option>
                                </select>
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