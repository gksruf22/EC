import { Link } from 'react-router-dom';
import { FaInstagram, FaGithub } from 'react-icons/fa';
import { SiNotion } from 'react-icons/si';
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
            <img src={logo} alt="Logo" className="footer-logo-img" />
            <h3>Endless Creation</h3>
          </div>
          <p>Designed By{" "}
            <a href="https://github.com/gksruf22" target="_blank" rel="noopener noreferrer">조한결</a>
            {" "}
            <a href="https://github.com/beagnihtemos14" target="_blank" rel="noopener noreferrer">안은빈</a>
            {" "}
            <a href="https://github.com/chae006" target="_blank" rel="noopener noreferrer">김채영</a>
          </p>
          <p className="copyright">© 2026 Endless Creation. All rights reserved.</p>
        </div>

        {/* 중앙: 바로 가기 */}
        <div className="footer-links">
          <h4>바로 가기</h4>
          <ul>
            <li><Link to="/about">소개</Link></li>
            <li><Link to="/members">구성원</Link></li>
            <li><Link to="/apply">지원하기</Link></li>
            <li><Link to="/notice">공지사항</Link></li>
          </ul>
        </div>

        {/* 오른쪽: SNS 또는 연락처 */}
        <div className="footer-contact">
          <h4>연락처</h4>
          <p>Email: seoultech.ec@gmail.com</p>
          <div className="social-icons">
            <a href="https://www.instagram.com/endless__creation/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://github.com/Endless-Creation-Official" target="_blank" rel="noopener noreferrer" aria-label="Github">
              <FaGithub />
            </a>
            <a href="https://blush-opal-daf.notion.site/Endless-Creation-2f3ff8b6d33f80a4ab21d4babb18ab40" target="_blank" rel="noopener noreferrer" aria-label="Notion">
              <SiNotion />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;