import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import EventForm, { type EventData } from './EventForm';

const EventCreate: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (data: EventData) => {
        try {
            await api.post('/admin/events', data);
            alert("공고가 성공적으로 등록되었습니다.");
            navigate('/admin/applications');
        } catch (err) {
            console.error("공고 등록 실패:", err);
            alert("공고 등록 중 오류가 발생했습니다.");
        }
    };

    return <EventForm onSubmit={handleSubmit} />;
};

export default EventCreate;
