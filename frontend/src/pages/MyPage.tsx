import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';

import PasswordChangeModal from '../components/PasswordChangeModal';
import { useState } from 'react';

const MyPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

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
      <div className="mypage-header">
        <h1>마이페이지</h1>
      </div>
      
      <ul className="tablewrite">
        <li>
          <dl>
            <dt><span>아이디</span></dt>
            <dd>{user.email}</dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt><span>비밀번호</span></dt>
            <dd>
              <button type="button" className="btn-st3 bg-light" title="비밀번호 변경" onClick={() => setIsPasswordModalOpen(true)}>
                비밀번호 변경
              </button>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt><span>이름</span></dt>
            <dd>{user.name}</dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt><span>학번</span></dt>
            <dd>{user.studentId}</dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt><span>전화번호</span></dt>
            <dd>{user.phoneNumber}</dd>
          </dl>
        </li>
      </ul>

      <div className="action-buttons">
        <button onClick={handleLogout} className="btn-logout">
          로그아웃
        </button>
      </div>
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default MyPage;
