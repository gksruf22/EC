import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Apply.css';

interface EventItem {
  id: number;
  title: string;
  description: string;
  eventType: 'RECRUITMENT' | 'GENERAL';
  status: 'READY' | 'OPEN' | 'CLOSED';
  startDate: string;
  endDate: string;
  generation: number;
}

const Apply = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'list' | 'detail' | 'form'>('list');
  const [selectedItem, setSelectedItem] = useState<EventItem | null>(null);

  const [formData, setFormData] = useState({ motive: '', experience: '' });

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('모집 공고를 불러오는데 실패했습니다.');
      }
    };
    fetchEvents();
  }, []);

  const handleItemClick = (item: EventItem) => {
    setSelectedItem(item);
    setStep('detail');
    window.scrollTo(0, 0);
  };

  const handleStartApply = () => {
    if (!isAuthenticated) {
      alert('지원을 위해 로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    setStep('form');
    window.scrollTo(0, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const payload = {
        generation: selectedItem.generation,
        eventId: selectedItem.id,
        motive: selectedItem.eventType === 'RECRUITMENT' ? formData.motive : '일반 활동 지원',
        experience: selectedItem.eventType === 'RECRUITMENT' ? formData.experience : '없음'
      };

      await api.post('/applications', payload);
      alert('지원이 완료되었습니다!');
      navigate('/');
    } catch (error: any) {
      console.error('Apply failed:', error);
      const errorData = error.response?.data;
      const errorMessage = (typeof errorData === 'string' ? errorData : errorData?.message) || '지원 신청에 실패했습니다. 관리자에게 문의해주세요.';
      alert(errorMessage);
    }
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return <span className="badge open">모집 중</span>;
      case 'READY': return <span className="badge ready">모집 예정</span>;
      case 'CLOSED': return <span className="badge closed">마감</span>;
      default: return null;
    }
  };

  return (
    <div className="apply-page">
      {/* 1. List View */}
      {step === 'list' && (
        <div className="apply-list-full">
          <div className="List-header">
            <h1>지원하기</h1>
            <p className="subtitle">현재 모집 중인 항목을 확인하고 지원하세요.</p>
          </div>
          <div className="recruitment-list-vertical">
            {error ? (
              <p className="no-data error">{error}</p>
            ) : events.length === 0 ? (
              <p className="no-data">현재 진행 중인 모집이 없습니다.</p>
            ) : (
              events.map(item => (
                <div key={item.id} className="recruitment-card" onClick={() => handleItemClick(item)}>
                  {getStatusBadge(item.status)}
                  <h3>{item.title}</h3>
                  <p className="period">{formatDate(item.startDate)} ~ {formatDate(item.endDate)}</p>
                  <p className="type-badge">{item.eventType === 'RECRUITMENT' ? '정기 모집' : '일반 활동'}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. Detail View */}
      {step === 'detail' && selectedItem && (
        <div className="apply-container detail-view">
          <button className="back-btn" onClick={() => setStep('list')}>← 목록으로</button>
          <h1>{selectedItem.title}</h1>
          
          <div className="info-grid">
            <div className="info-item">
              <strong>모집 기간</strong>
              <span>{formatDate(selectedItem.startDate)} ~ {formatDate(selectedItem.endDate)}</span>
            </div>
            <div className="info-item">
              <strong>구분</strong>
              <span>{selectedItem.eventType === 'RECRUITMENT' ? '정기 모집' : '일반 활동'}</span>
            </div>
          </div>

          <div className="detail-content">
            <h3>설명</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{selectedItem.description}</p>
          </div>

          {selectedItem.status === 'OPEN' ? (
            <button className="apply-start-btn" onClick={handleStartApply}>지원하기</button>
          ) : selectedItem.status === 'READY' ? (
            <button className="apply-start-btn" disabled style={{ background: '#ccc', cursor: 'not-allowed' }}>모집 예정</button>
          ) : (
            <button className="apply-start-btn" disabled style={{ background: '#999', cursor: 'not-allowed' }}>모집 마감</button>
          )}
        </div>
      )}

      {/* 3. Form View */}
      {step === 'form' && selectedItem && (
        <div className="apply-container form-view">
          <button className="back-btn" onClick={() => setStep('detail')}>← 이전으로</button>
          <h1>지원서 작성</h1>
          <p className="selected-title">{selectedItem.title}</p>
          
          <form onSubmit={handleSubmit} className="apply-form">
            <section className="info-section">
              <h3>기본 정보</h3>
              <div className="input-group"><label>이름</label><input type="text" value={user?.name || ''} disabled /></div>
              <div className="input-group"><label>학번</label><input type="text" value={user?.studentId || ''} disabled /></div>
              <div className="input-group"><label>전화번호</label><input type="text" value={user?.phoneNumber || ''} disabled /></div>
            </section>

            {selectedItem.eventType === 'RECRUITMENT' ? (
              <section className="content-section">
                <div className="input-group">
                  <label>지원 동기</label>
                  <textarea name="motive" value={formData.motive} onChange={handleChange} required rows={8} placeholder="지원 동기를 작성해주세요." />
                </div>
                <div className="input-group">
                  <label>관련 경험</label>
                  <textarea name="experience" value={formData.experience} onChange={handleChange} required rows={8} placeholder="관련된 경험이나 프로젝트가 있다면 작성해주세요." />
                </div>
              </section>
            ) : (
              <section className="content-section">
                <div className="notice-box">
                  <p>이 활동은 별도의 지원서 작성 없이 바로 신청이 가능합니다.</p>
                  <p>아래 '신청하기' 버튼을 누르면 접수가 완료됩니다.</p>
                </div>
              </section>
            )}

            <button type="submit" className="submit-btn">{selectedItem.eventType === 'RECRUITMENT' ? '제출하기' : '신청하기'}</button>
          </form>
        </div>
      )}
    </div>
  );
};
export default Apply;