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
      <div className="mypage-header">
        <h1>마이페이지</h1>
      </div>
      
      <ul className="tablewrite">
        <li>
          <dl>
            <dt><span className="point">아이디</span></dt>
            <dd>{user.email}</dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt><span className="point">비밀번호</span></dt>
            <dd>
              <button type="button" className="btn-st3 bg-light" title="비밀번호 변경" onClick={() => alert('비밀번호 변경 기능은 준비중입니다.')}>
                비밀번호 변경
              </button>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt><span className="point">이름</span></dt>
            <dd>{user.name}</dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt><span className="point">학번</span></dt>
            <dd>{user.studentId}</dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt><span className="point">전화번호</span></dt>
            <dd>{user.phoneNumber}</dd>
          </dl>
        </li>
      </ul>

      <div className="action-buttons">
        <button onClick={handleLogout} className="btn-logout">
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyPage;
