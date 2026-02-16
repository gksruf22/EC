import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import EventForm, { type EventData } from './EventForm';

const EventEdit: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<EventData | undefined>(undefined);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${id}`);
                setInitialData(res.data);
            } catch (err) {
                console.error("공고 정보 로드 실패:", err);
                alert("공고 정보를 불러오는데 실패했습니다.");
                navigate(-1);
            }
        };

        if (id) {
            fetchEvent();
        }
    }, [id, navigate]);

    const handleSubmit = async (data: EventData) => {
        try {
            await api.put(`/admin/events/${id}`, data);
            alert("공고가 성공적으로 수정되었습니다.");
            navigate(`/admin/applications/${id}`);
        } catch (err) {
            console.error("공고 수정 실패:", err);
            alert("공고 수정 중 오류가 발생했습니다.");
        }
    };

    if (!initialData) return <div>로딩 중...</div>;

    return <EventForm initialData={initialData} onSubmit={handleSubmit} isEditMode={true} />;
};

export default EventEdit;
