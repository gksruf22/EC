import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, Trash2, Copy } from 'lucide-react';
import api from '../../utils/api';
import './PassFailSettingsManagement.css';

interface EventSummary {
    id: number;
    title: string;
    generation: number;
}

interface PassFailSettings {
    id?: number;
    eventId: number;
    eventTitle?: string;
    generation?: number;
    mode: 'first' | 'final';
    isActive: boolean;
    startDate: string;
    endDate: string;
    interviewLink: string;
}

const PassFailSettingsManagement: React.FC = () => {
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [settingsList, setSettingsList] = useState<PassFailSettings[]>([]);
    const [events, setEvents] = useState<EventSummary[]>([]);
    const [loading, setLoading] = useState(false);

    // Form states
    const [selectedEventId, setSelectedEventId] = useState<number | ''>('');
    const [mode, setMode] = useState<'first' | 'final'>('first');
    const [formData, setFormData] = useState<PassFailSettings>({
        eventId: 0,
        mode: 'first',
        isActive: false,
        startDate: '',
        endDate: '',
        interviewLink: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (viewMode === 'list') {
            fetchAllSettings();
        } else {
            fetchEvents();
        }
    }, [viewMode]);

    useEffect(() => {
        if (viewMode === 'form' && !isEditing && selectedEventId) {
            // When adding new and selecting an event/mode, we could optionally fetch existing, 
            // but normally they save and overwrite. Let's just fetch if it exists to avoid accidental overwrite without seeing it.
            fetchSingleSetting(selectedEventId, mode);
        }
    }, [selectedEventId, mode, isEditing, viewMode]);

    const fetchAllSettings = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/pass-fail-settings/all');
            setSettingsList(res.data);
        } catch (err) {
            console.error('설정 목록 로딩 실패', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events');
            setEvents(res.data);
        } catch (err) {
            console.error('이벤트 목록 로딩 실패', err);
        }
    };

    const fetchSingleSetting = async (eventId: number, currentMode: 'first' | 'final') => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/pass-fail-settings?eventId=${eventId}&mode=${currentMode}`);
            const data = res.data;
            setFormData({
                id: data.id,
                eventId: data.eventId || eventId,
                mode: data.mode || currentMode,
                isActive: data.isActive,
                startDate: data.startDate ? data.startDate.substring(0, 16) : '',
                endDate: data.endDate ? data.endDate.substring(0, 16) : '',
                interviewLink: data.interviewLink || ''
            });
        } catch (err) {
            console.error('설정 데이터 로딩 실패', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setIsEditing(false);
        setSelectedEventId('');
        setMode('first');
        setFormData({
            eventId: 0,
            mode: 'first',
            isActive: false,
            startDate: '',
            endDate: '',
            interviewLink: ''
        });
        setViewMode('form');
    };

    const handleEditClick = (setting: PassFailSettings) => {
        setIsEditing(true);
        setSelectedEventId(setting.eventId);
        setMode(setting.mode);
        setFormData({
            id: setting.id,
            eventId: setting.eventId,
            mode: setting.mode,
            isActive: setting.isActive,
            startDate: setting.startDate ? setting.startDate.substring(0, 16) : '',
            endDate: setting.endDate ? setting.endDate.substring(0, 16) : '',
            interviewLink: setting.interviewLink || ''
        });
        setViewMode('form');
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        if (window.confirm('정말 이 합격자 조회 설정을 삭제하시겠습니까? 지원자가 더 이상 해당 결과를 조회할 수 없게 될 수 있습니다.')) {
            try {
                await api.delete(`/admin/pass-fail-settings/${id}`);
                alert('설정이 삭제되었습니다.');
                fetchAllSettings();
            } catch (err) {
                console.error('설정 삭제 실패', err);
                alert('삭제에 실패했습니다.');
            }
        }
    };

    const handleSave = async () => {
        if (!selectedEventId) {
            alert('이벤트를 선택해주세요.');
            return;
        }

        try {
            const payload = {
                ...formData,
                eventId: selectedEventId,
                mode: mode,
                startDate: formData.startDate ? `${formData.startDate}:00` : null,
                endDate: formData.endDate ? `${formData.endDate}:00` : null
            };

            await api.post('/admin/pass-fail-settings', payload);
            alert('설정이 저장되었습니다.');
            setViewMode('list');
        } catch (err) {
            console.error('설정 저장 실패', err);
            alert('저장에 실패했습니다.');
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '미지정';
        return dateString.replace('T', ' ').substring(0, 16);
    };

    const getStatusDisplay = (setting: PassFailSettings) => {
        if (!setting.isActive) {
            return <span style={{ color: '#ef4444', fontWeight: 'bold' }}>비활성</span>;
        }

        const now = new Date();
        const start = setting.startDate ? new Date(setting.startDate) : null;
        const end = setting.endDate ? new Date(setting.endDate) : null;

        if (start && now < start) {
            return <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>기간 시작 전</span>;
        }
        if (end && now > end) {
            return <span style={{ color: '#6b7280', fontWeight: 'bold' }}>조회 마감됨</span>;
        }

        return <span style={{ color: '#10b981', fontWeight: 'bold' }}>조회 진행 중</span>;
    };

    return (
        <div className="admin-pass-fail-page">
            <div className="admin-pass-fail-header">
                <h1>합격자 조회 설정</h1>
            </div>

            {viewMode === 'list' && (
                <div className="admin-application-toolbar" style={{ justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <button className="add-btn" onClick={handleAddClick}>
                        <Plus size={20} /> 새 설정 추가
                    </button>
                </div>
            )}

            <div className="settings-container" style={{ padding: viewMode === 'list' ? '0' : '2rem' }}>
                {viewMode === 'list' ? (
                    loading ? (
                        <div className="loading-state" style={{ padding: '2rem', textAlign: 'center' }}>데이터를 불러오는 중...</div>
                    ) : settingsList.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>등록된 합격자 조회 설정이 없습니다.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="admin-application-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid #eee' }}>기수 / 활동명</th>
                                        <th style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '2px solid #eee' }}>전형 단계</th>
                                        <th style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '2px solid #eee' }}>활성화 상태</th>
                                        <th style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '2px solid #eee' }}>조회 기간</th>
                                        <th style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '2px solid #eee' }}>관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {settingsList.map((setting) => (
                                        <tr
                                            key={setting.id}
                                            onClick={() => handleEditClick(setting)}
                                            style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
                                            className="settings-row"
                                        >
                                            <td style={{ padding: '12px 16px' }}>
                                                <strong>{setting.generation}기</strong> {setting.eventTitle}
                                            </td>
                                            <td style={{ textAlign: 'center', padding: '12px 16px' }}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    backgroundColor: setting.mode === 'first' ? '#eef2ff' : '#fef3c7',
                                                    color: setting.mode === 'first' ? '#4f46e5' : '#d97706',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    {setting.mode === 'first' ? '1차 서류' : '최종 합격'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center', padding: '12px 16px' }}>
                                                {getStatusDisplay(setting)}
                                            </td>
                                            <td style={{ textAlign: 'center', padding: '12px 16px', fontSize: '0.9rem' }}>
                                                {formatDate(setting.startDate)} ~ {formatDate(setting.endDate)}
                                            </td>
                                            <td style={{ textAlign: 'center', padding: '12px 16px' }} onClick={(e) => e.stopPropagation()}>
                                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                    <button
                                                        onClick={() => {
                                                            const url = `${window.location.origin}/check-status?eventId=${setting.eventId}&mode=${setting.mode}`;
                                                            navigator.clipboard.writeText(url).then(() => {
                                                                alert('조회 링크가 복사되었습니다:\n' + url);
                                                            }).catch(() => {
                                                                alert('링크 복사에 실패했습니다.');
                                                            });
                                                        }}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                                                        title="조회 링크 복사하기"
                                                    >
                                                        <Copy size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(setting.id)}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                                                        title="삭제하기"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    /* FORM VIEW */
                    <div className="settings-panel">
                        <button
                            className="back-btn"
                            onClick={() => setViewMode('list')}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 'bold' }}
                        >
                            <ChevronLeft size={20} /> 목록으로 돌아가기
                        </button>

                        <h2 style={{ marginBottom: '1.5rem' }}>{isEditing ? '조회 설정 수정' : '새 조회 설정 등록'}</h2>

                        <div className="form-group row">
                            <label>대상 기수/모집 선택</label>
                            <select
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(Number(e.target.value) || '')}
                                className="form-control"
                                disabled={isEditing}
                                style={{ backgroundColor: isEditing ? '#f5f5f5' : 'white' }}
                            >
                                <option value="">-- 이벤트를 선택하세요 --</option>
                                {events.map((ev) => (
                                    <option key={ev.id} value={ev.id}>
                                        {ev.title} (기수: {ev.generation})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedEventId && (
                            <>
                                <div className="mode-toggle">
                                    <button
                                        className={`mode-btn ${mode === 'first' ? 'active' : ''}`}
                                        onClick={() => setMode('first')}
                                        disabled={isEditing && mode !== 'first'}
                                        style={{ opacity: isEditing && mode !== 'first' ? 0.5 : 1, cursor: isEditing && mode !== 'first' ? 'not-allowed' : 'pointer' }}
                                    >
                                        1차 합격 설정
                                    </button>
                                    <button
                                        className={`mode-btn ${mode === 'final' ? 'active' : ''}`}
                                        onClick={() => setMode('final')}
                                        disabled={isEditing && mode !== 'final'}
                                        style={{ opacity: isEditing && mode !== 'final' ? 0.5 : 1, cursor: isEditing && mode !== 'final' ? 'not-allowed' : 'pointer' }}
                                    >
                                        최종 합격 설정
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="loading-state">데이터를 갱신 중...</div>
                                ) : (
                                    <div className="settings-form">
                                        <div className="form-group toggle-group">
                                            <label>조회 활성화 여부</label>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isActive}
                                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                            <span className="toggle-label">
                                                {formData.isActive ? '설정은 활성화되었으나, 실제 합격자 페이지 노출 여부는 아래 시작/종료 일시에 맞게 자동 조정됩니다.' : '비활성화됨 (기간에 상관없이 지원자 조회 불가)'}
                                            </span>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group half">
                                                <label>조회 시작 일시</label>
                                                <input
                                                    type="datetime-local"
                                                    value={formData.startDate}
                                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                    className="form-control"
                                                />
                                            </div>
                                            <div className="form-group half">
                                                <label>조회 종료 일시</label>
                                                <input
                                                    type="datetime-local"
                                                    value={formData.endDate}
                                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>

                                        {mode === 'first' && (
                                            <div className="form-group mt-3">
                                                <label>면접 일정 입력 링크(1차 합격자에게만 이 버튼이 노출됩니다.)</label>
                                                <input
                                                    type="url"
                                                    value={formData.interviewLink}
                                                    onChange={(e) => setFormData({ ...formData, interviewLink: e.target.value })}
                                                    className="form-control"
                                                    placeholder="https://docs.google.com/spreadsheets/d/..."
                                                />
                                            </div>
                                        )}

                                        <div className="form-actions">
                                            <button className="save-btn" onClick={handleSave}>
                                                변경사항 저장
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PassFailSettingsManagement;
