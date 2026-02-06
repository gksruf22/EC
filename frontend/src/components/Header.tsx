import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Service Logo" className="logo-img" />
        </Link>
      </div>
      <nav>
        <ul className="nav-links">
          <li><Link to="/">홈</Link></li>
          <li><Link to="/about">소개</Link></li>
          <li><Link to="/members">구성원</Link></li>
          <li><Link to="/apply">지원하기</Link></li>
          <li><Link to="/notice">공지사항</Link></li>
        </ul>
      </nav>
      <div className="header-right">
        {isAuthenticated ? (
          <Link to="/mypage" className="user-name">
            {user?.name}님
          </Link>
        ) : (
          <>
            <Link to="/signup" className="signup">회원가입</Link>
            <span className="separator">|</span>
            <Link to="/login" className="login">로그인</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;