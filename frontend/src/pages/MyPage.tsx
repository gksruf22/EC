import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';

import PasswordChangeModal from '../components/PasswordChangeModal';
import { useState, useEffect } from 'react';

const MyPage = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      const confirmLogin = window.confirm('로그인이 필요한 페이지입니다. 로그인페이지로 이동하시겠습니까?');
      if (confirmLogin) {
        navigate('/login');
      } else {
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

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

      {/* 나중에 로직 추가 */}
      <div className="action-buttons">
        <button className="btn-infoedit">
          정보 수정 요청
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
