import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* 왼쪽: 브랜드 정보 */}
        <div className="footer-info">
          {/* 로고와 이름을 감싸는 새로운 div 추가 */}
          <div className="footer-logo-area">
            <img src={logo} alt="Logo" className="footer-logo-img"/>
            <h3>Endless Creation</h3>
          </div>
          <p>Designed By{" "}
            <a href="https://github.com/gksruf22" target="_blank" rel="noopener noreferrer">조한결</a>
            {" "}
            <a href="https://github.com/beagnihtemos14" target="_blank" rel="noopener noreferrer">안은빈</a>
            {" "}
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer">OOO</a>
          </p>
          <p className="copyright">© 2026 Endless Creation. All rights reserved.</p>
        </div>

        {/* 중앙: 바로 가기 */}
        <div className="footer-links">
          <h4>바로 가기</h4>
          <ul>
            <li><Link to="/about">소개</Link></li>
            <li><Link to="/members">구성원</Link></li>
            <li><Link to="/notice">공지사항</Link></li>
          </ul>
        </div>

        {/* 오른쪽: SNS 또는 연락처 */}
        <div className="footer-contact">
          <h4>연락처</h4>
          <p>Email: contact@mybrand.com</p>
          <div className="social-icons">
            <span>Instagram</span>
            <span>Twitter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;