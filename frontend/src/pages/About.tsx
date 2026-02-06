import './About.css';
import { FaRocket, FaUsers, FaCode } from 'react-icons/fa';

const About = () => {
  return (
    <div className="about-page">
      {/* 1. 상단 배너 영역 */}
      <section className="about-hero">
        <div className="container">
          <h1>Endless Creation</h1>
          <h2>Since 1991</h2>
          <p>EC(Endless Creation)는 사람과 컴퓨터를 사랑하는 동아리입니다.<br />창립한 지 35년째 되는 서울과학기술대학교에서 가장 오래된 역사 깊은 동아리입니다!</p>
        </div>
      </section>

      {/* 2. 미션 및 핵심 가치 섹션 */}
      <section className="about-values">
        <div className="container">
          <div className="section-title">
            <h2>Our Core Values</h2>
            <div className="underline"></div>
          </div>
          {/* 텍스트 배열 수정 및 각 제목에 아이콘 추가 필요*/}
          <div className="value-cards">
            <div className="card">
              <div className="icon-wrapper">
                <FaRocket className="value-icon"/>
              </div>
              <h3>Growth</h3>
              <p>EC는 개인의 성장을 넘어서 단체의 성장도 중요시 합니다.<br />EC와 함께 열심히 활동하며 개인의 역량도 기르고 성장해 보세요.</p>
            </div>
            <div className="card">
              <div className="icon-wrapper">
                <FaUsers className="value-icon"/>
              </div>
              <h3>Sharing</h3>
              <p>EC에서는 다양한 스터디를 하며 지식을 공유합니다.<br />세미나, 정기 세션 등에서 지식을 공유하며 성장해 보세요.</p>
            </div>
            <div className="card">
              <div className="icon-wrapper">
                <FaCode className="value-icon"/>
              </div>
              <h3>Cooperation</h3>
              <p>EC에서는 해커톤, 어드벤스 등에서 같이 협력하며 프로젝트를 진행합니다.<br />이 프로젝트를 통해 협동심을 기르고 의미있는 프로젝트를 만들어 보세요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 수정 필요 */}
      {/*<section className="about-history">
        <div className="container">
          <h2>Our Journey</h2>
          <div className="timeline">
            <div className="time-item"><strong>2024.10</strong> - 서비스 베타 런칭</div>
            <div className="time-item"><strong>2025.03</strong> - 누적 사용자 10만 돌파</div>
            <div className="time-item"><strong>2026.02</strong> - 글로벌 서비스 확장</div>
          </div>
        </div>
      </section>*/}
    </div>
  );
};

export default About;