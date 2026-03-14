import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    closeMenu();
    await logout();
    alert('로그아웃되었습니다.');
    navigate('/');
  };

  return (
    <header className="header">
      {/* 1. 로고 영역 */}
      <div className="logo">
        <Link to="/" onClick={closeMenu}>
          <img src={logo} alt="Service Logo" className="logo-img" />
        </Link>
      </div>

      {/* 2. 네비게이션 영역 (모바일 상태 포함) */}
      <nav className={`nav-container ${isMenuOpen ? 'active' : ''}`}>
        <ul className="nav-links">
          <li><Link to="/" onClick={closeMenu}>홈</Link></li>
          <li><Link to="/about" onClick={closeMenu}>소개</Link></li>
          <li><Link to="/members" onClick={closeMenu}>구성원</Link></li>
          <li><Link to="/apply" onClick={closeMenu}>지원하기</Link></li>
          <li><Link to="/notice" onClick={closeMenu}>공지사항</Link></li>
        </ul>

        {/* 모바일에서만 보이는 로그인/회원가입 섹션 */}
        <div className="mobile-auth">
          {isAuthenticated ? (
            <>
              <Link to={user?.role === 'ROLE_ADMIN' ? '/admin' : '/mypage'} onClick={closeMenu}>{user?.name}님</Link>
              <a href="/" onClick={handleLogout}>로그아웃</a>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>로그인</Link>
              <Link to="/signup" onClick={closeMenu}>회원가입</Link>
            </>
          )}
        </div>
      </nav>

      {/* 3. 데스크톱 전용 우측 영역 */}
      <div className="header-right">
        {isAuthenticated ? (
          <>
            <Link to={user?.role === 'ROLE_ADMIN' ? '/admin' : '/mypage'} className="user-name">{user?.name}님</Link>
            <span className="separator">|</span>
            <a href="/" onClick={handleLogout} className="logout">로그아웃</a>
          </>
        ) : (
          <>
            <Link to="/signup" className="signup">회원가입</Link>
            <span className="separator">|</span>
            <Link to="/login" className="login">로그인</Link>
          </>
        )}
      </div>

      {/* 4. 햄버거 버튼 (모바일 전용) */}
      <button className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </header>
  );
};

export default Header;