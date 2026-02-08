import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';

const MyPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    alert('로그아웃되었습니다.');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="mypage-container">
        <div className="mypage-box">
          <h1>로그인이 필요합니다</h1>
          <button onClick={() => navigate('/login')} className="btn-primary">
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      <div className="mypage-box">
        <h1>마이페이지</h1>
        
        <div className="user-info-section">
          <h2>내 정보</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>이름</label>
              <span>{user.name}</span>
            </div>
            <div className="info-item">
              <label>이메일</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>학번</label>
              <span>{user.studentId}</span>
            </div>
            <div className="info-item">
              <label>전화번호</label>
              <span>{user.phoneNumber}</span>
            </div>
            <div className="info-item">
              <label>권한</label>
              <span className={user.role === 'ROLE_ADMIN' ? 'badge-admin' : 'badge-user'}>
                {user.role === 'ROLE_ADMIN' ? '관리자' : '일반 회원'}
              </span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={handleLogout} className="btn-logout">
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
