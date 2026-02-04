import './Header.css';
import logo from '../assets/logo.png';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <a href="/">
          <img src={logo} alt="Service Logo" className="logo-img" />
        </a>
      </div>
      <nav>
        <ul className="nav-links">
          <li><a href="/">홈</a></li>
          <li><a href="/about">소개</a></li>
          <li><a href="/about">구성원</a></li>
          <li><a href="/about">공지사항</a></li>
        </ul>
      </nav>
      <div className="header-right">
        <a href="/signup" className="signup">회원가입</a>
        <a href="/login" className="login">로그인</a>
      </div>
    </header>
  );
};

export default Header;