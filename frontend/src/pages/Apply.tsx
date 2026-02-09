import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Apply.css';

// 지원 항목 데이터 (나중에 백엔드 연동 가능)
const recruitmentList = [
  {
    id: 1,
    title: "2026년 EC 35기 신입 부원 정기 모집",
    period: "2026.02.01 ~ 2026.03.15",
    target: "서울과학기술대학교 재학생 (전공 무관)",
    description: "사람과 컴퓨터를 사랑하는 EC에서 35기 신입 부원을 모집합니다! 함께 스터디하고 프로젝트를 진행하며 성장할 열정 넘치는 분들을 기다립니다.",
    qualifications: ["개발에 관심이 있는 분", "매주 정기 세미나 참석이 가능한 분", "협업의 가치를 소중히 여기는 분"]
  },
  {
    id: 2,
    title: "2026 상반기 내부 해커톤 'Endless Hack' 운영진 모집",
    period: "2026.03.20 ~ 2026.03.30",
    target: "EC 정부원",
    description: "EC의 꽃, 해커톤을 기획하고 운영할 운영진을 모집합니다.",
    qualifications: ["기획 및 디자인에 관심 있는 부원", "행사 운영 경험을 쌓고 싶은 부원"]
  }
];

const Apply = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 화면 전환 상태: 'list' | 'detail' | 'form'
  const [step, setStep] = useState<'list' | 'detail' | 'form'>('list');
  const [selectedItem, setSelectedItem] = useState<typeof recruitmentList[0] | null>(null);

  const [formData, setFormData] = useState({ motive: '', experience: '' });

  // 리스트에서 항목 클릭 시 상세 정보로 이동
  const handleItemClick = (item: typeof recruitmentList[0]) => {
    setSelectedItem(item);
    setStep('detail');
    window.scrollTo(0, 0);
  };

  // 상세 정보에서 '지원하기' 클릭 시 폼으로 이동 (로그인 체크)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('제출 데이터:', { recruitmentId: selectedItem?.id, ...user, ...formData });
    alert('지원이 완료되었습니다!');
    navigate('/');
  };

  return (
    <div className="apply-page">
      {/* --- 1. 리스트 화면 --- */}
      {step === 'list' && (
        <div className="apply-list-full">
          <div className="List-header">
            <h1>지원하기</h1>
            <p className="subtitle">현재 모집 중인 항목을 확인하고 지원하세요.</p>
          </div>
          <div className="recruitment-list-vertical">
            {recruitmentList.map(item => (
              <div key={item.id} className="recruitment-card" onClick={() => handleItemClick(item)}>
                <span className="badge">모집 중</span>
                <h3>{item.title}</h3>
                <p className="period">{item.period}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- 2. 상세 정보 화면 --- */}
      {step === 'detail' && selectedItem && (
        <div className="apply-container detail-view">
          <button className="back-btn" onClick={() => setStep('list')}>← 목록으로</button>
          <h1>{selectedItem.title}</h1>
          
          <div className="info-grid">
            <div className="info-item">
              <strong>신청 기간</strong>
              <span>{selectedItem.period}</span>
            </div>
            <div className="info-item">
              <strong>지원 자격</strong>
              <span>{selectedItem.target}</span>
            </div>
          </div>

          <div className="detail-content">
            <h3>설명</h3>
            <p>{selectedItem.description}</p>
            
            <h3>상세 요건</h3>
            <ul>
              {selectedItem.qualifications.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>

          <button className="apply-start-btn" onClick={handleStartApply}>지원하기</button>
        </div>
      )}

      {/* --- 3. 지원서 작성 폼 (기존 내용) --- */}
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

            <section className="content-section">
              <div className="input-group">
                <label>지원 동기</label>
                <textarea name="motive" value={formData.motive} onChange={handleChange} required rows={8} />
              </div>
              <div className="input-group">
                <label>관련 경험</label>
                <textarea name="experience" value={formData.experience} onChange={handleChange} required rows={8} />
              </div>
            </section>
            <button type="submit" className="submit-btn">제출하기</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Apply;