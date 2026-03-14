import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './EventForm.css';

interface EventFormProps {
    initialData?: EventData;
    onSubmit: (data: EventData) => Promise<void>;
    isEditMode?: boolean;
}

export interface EventData {
    title: string;
    description: string;
    eventType: 'RECRUITMENT' | 'GENERAL';
    status: 'READY' | 'OPEN' | 'CLOSED';
    startDate: string;
    endDate: string;
    maxParticipants?: number;
    generation: number;
}

const EventForm: React.FC<EventFormProps> = ({ initialData, onSubmit, isEditMode = false }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<EventData>({
        title: '',
        description: '',
        eventType: 'RECRUITMENT',
        status: 'READY',
        startDate: '',
        endDate: '',
        maxParticipants: 0,
        generation: 0
    });

    const [isLimitParticipants, setIsLimitParticipants] = useState(false);

    useEffect(() => {
        if (initialData) {
            // 날짜 포맷팅 (ISO string -> YYYY-MM-DDTHH:mm)
            const formatForInput = (dateStr: string) => {
                if (!dateStr) return '';
                const date = new Date(dateStr);
                const offset = date.getTimezoneOffset() * 60000;
                return (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
            };

            setFormData({
                ...initialData,
                startDate: formatForInput(initialData.startDate),
                endDate: formatForInput(initialData.endDate)
            });

            // 초기 데이터에 maxParticipants가 있으면 체크박스 활성화
            if (initialData.maxParticipants && initialData.maxParticipants > 0) {
                setIsLimitParticipants(true);
            }
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: EventData) => ({
            ...prev,
            [name]: name === 'generation' || name === 'maxParticipants' ? Number(value) : value
        }));
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsLimitParticipants(e.target.checked);
        if (!e.target.checked) {
            setFormData(prev => ({ ...prev, maxParticipants: 0 }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSubmit = {
            ...formData,
            maxParticipants: isLimitParticipants ? formData.maxParticipants : undefined
        };
        await onSubmit(dataToSubmit);
    };

    return (
        <div className="event-form-container">
            <div className="form-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={20} /> 뒤로가기
                </button>
            </div>

            <form onSubmit={handleSubmit} className="event-form">
                <h2>{isEditMode ? '공고 수정' : '공고 등록'}</h2>

                <div className="form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="공고 제목을 입력하세요"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group half">
                        <label>활동 분류</label>
                        <select name="eventType" value={formData.eventType} onChange={handleChange}>
                            <option value="RECRUITMENT">정기 모집</option>
                            <option value="GENERAL">일반 활동</option>
                        </select>
                    </div>
                    {formData.eventType === 'RECRUITMENT' && (
                        <div className="form-group half">
                            <label>모집 기수</label>
                            <input
                                type="number"
                                name="generation"
                                value={formData.generation}
                                onChange={handleChange}
                                required={formData.eventType === 'RECRUITMENT'}
                                min="1"
                            />
                        </div>
                    )}
                </div>

                <div className="form-row">
                    <div className="form-group half">
                        <label>상태</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="READY">준비 중</option>
                            <option value="OPEN">모집 중</option>
                            <option value="CLOSED">마감</option>
                        </select>
                    </div>
                    <div className="form-group half">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            최대 인원 (선택)
                            <input
                                type="checkbox"
                                checked={isLimitParticipants}
                                onChange={handleLimitChange}
                                style={{ width: 'auto' }}
                            />
                        </label>
                        <input
                            type="number"
                            name="maxParticipants"
                            value={formData.maxParticipants || ''}
                            onChange={handleChange}
                            placeholder={isLimitParticipants ? "최대 인원 입력" : "제한 없음"}
                            disabled={!isLimitParticipants}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group half">
                        <label>시작 일시</label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group half">
                        <label>종료 일시</label>
                        <input
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>상세 설명</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={10}
                        placeholder="공고 내용을 마크다운 형식으로 입력하세요..."
                    />
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>취소</button>
                    <button type="submit" className="submit-btn">{isEditMode ? '수정 완료' : '등록 하기'}</button>
                </div>
            </form >
        </div >
    );
};

export default EventForm;
