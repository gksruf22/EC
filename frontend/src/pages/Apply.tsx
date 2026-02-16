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
  applied: boolean;
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
        eventId: selectedItem.id,
        motive: formData.motive || (selectedItem.eventType === 'GENERAL' ? '일반 활동 신청' : ''),
        experience: formData.experience || (selectedItem.eventType === 'GENERAL' ? '해당 없음' : '')
      };

      await api.post('/applications', payload);
      alert('지원이 완료되었습니다!');


      window.location.href = '/apply';
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
        <>
          <section className="apply-hero">
            <div className="container">
              <h1>지원하기</h1>
              <p>현재 모집 중인 항목을 확인하고 지원하세요.</p>
            </div>
          </section>

          <div className="apply-table-container">
            <table className="apply-table">
              <thead>
                <tr>
                  <th className="apply-th-title">제목</th>
                  <th className="apply-th-period">모집 기간</th>
                  <th className="apply-th-status">상태</th>
                  <th className="apply-th-apply">모집 구분</th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? (
                  events.map(item => (
                    <tr
                      key={item.id}
                      className={`apply-row ${item.applied ? 'applied' : ''}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <td className="td-title">{item.title}</td>
                      <td className="td-period">{formatDate(item.startDate)} ~ {formatDate(item.endDate)}</td>
                      <td className="td-status">{getStatusBadge(item.status)}</td>
                      <td className="td-apply">{item.eventType === 'RECRUITMENT' ? '정기 모집' : '일반 활동'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="no-events">
                      등록된 모집 공고가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
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

          {selectedItem.applied ? (
            <button className="apply-start-btn completed" disabled>이미 신청한 활동입니다</button>
          ) : selectedItem.status === 'OPEN' ? (
            <button className="apply-start-btn" onClick={handleStartApply}>
              {selectedItem.eventType === 'RECRUITMENT' ? '지원하기' : '신청하기'}
            </button>
          ) : (
            <button className="apply-start-btn" disabled style={{ background: '#999', cursor: 'not-allowed' }}>
              {selectedItem.status === 'READY' ? '모집 예정' : '모집 마감'}
            </button>
          )}
        </div>
      )}

      {/* 3. Form View */}
      {step === 'form' && selectedItem && (
        <div className="apply-container form-view">
          <button className="back-btn" onClick={() => setStep('detail')}>← 이전으로</button>
          <h1>{selectedItem.eventType === 'RECRUITMENT' ? '지원서 작성' : '신청서 작성'}</h1>

          <form onSubmit={handleSubmit} className="apply-form">
            <section className="info-section">
              <div className="input-group"><label>이름</label><input type="text" value={user?.name || ''} disabled /></div>
              <div className="input-group"><label>학번</label><input type="text" value={user?.studentId || ''} disabled /></div>
              <div className="input-group"><label>전화번호</label><input type="text" value={user?.phoneNumber || ''} disabled /></div>
            </section>

            {selectedItem.eventType === 'RECRUITMENT' && (
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
            )}

            <button type="submit" className="submit-btn">{selectedItem.eventType === 'RECRUITMENT' ? '제출하기' : '신청하기'}</button>
          </form>
        </div>
      )}
    </div>
  );
};
export default Apply;