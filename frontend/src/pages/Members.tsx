import './Members.css';
import subImg from '../assets/sub.png';
// import kgtImg from '../assets/kgt.png';
import ljhImg from '../assets/ljh.png';
// import pghImg from '../assets/pgh.png';
import kcyImg from '../assets/kcy.jpeg';
import chgImg from '../assets/chg.jpg';
import ljsImg from '../assets/ljs.png';
import defaultImg from '../assets/default.png';

interface Member {
    id: number;
    name: string;
    role: string;
    department: string;
    studentId: string; // e.g. 21학번
    imageUrl: string;
}

interface Graduate {
    id: number;
    name: string;
    generation: string;
    techStack: string;
    career: string;
}

const Members = () => {
    const executives: Member[] = [
        {
            id: 1,
            name: '신우빈',
            role: '회장',
            department: '컴퓨터공학과',
            studentId: '25학번',
            imageUrl: subImg,
        },
        {
            id: 2,
            name: '김경태',
            role: '부회장',
            department: '컴퓨터공학과',
            studentId: '22학번',
            imageUrl: defaultImg,
        },
        {
            id: 3,
            name: '이재훈',
            role: '학술부장',
            department: '컴퓨터공학과',
            studentId: '24학번',
            imageUrl: ljhImg,
        },
        {
            id: 4,
            name: '박관호',
            role: '홍보부장',
            department: '컴퓨터공학과',
            studentId: '25학번',
            imageUrl: defaultImg,
        },
        {
            id: 5,
            name: '김채영',
            role: '기획부장',
            department: '컴퓨터공학과',
            studentId: '25학번',
            imageUrl: kcyImg,
        },
        {
            id: 6,
            name: '조한결',
            role: '인사부장',
            department: '컴퓨터공학과',
            studentId: '25학번',
            imageUrl: chgImg,
        },
        {
            id: 7,
            name: '이준석',
            role: '재무부장',
            department: '컴퓨터공학과',
            studentId: '25학번',
            imageUrl: ljsImg,
        },
    ];

    const mainExecutives = executives.slice(0, 2);
    const teamLeaders = executives.slice(2);

    const graduates: Graduate[] = [
        { id: 101, name: '오예진', generation: '29기', techStack: 'React', career: '前 AWS Cloud Club / 前 카카오엔터프라이즈 인턴 / 前 네이버 클라우드 인턴 / 現 카카오엔터프라이즈' },
        { id: 102, name: '황인서', generation: '28기', techStack: 'Front-end', career: '前 SW마에스트로 / 現 네이버' },
        { id: 103, name: '조재영', generation: '28기', techStack: 'Spring, Java, Back-end', career: '現 카카오뱅크' },
        { id: 104, name: '오정진', generation: '28기', techStack: 'React, Next.js', career: '前 YAPP 임원진 / 前 현대오토에버 인턴 / 現 앨리스' },
        { id: 105, name: '조인혁', generation: '27기', techStack: 'Spring, Node.js', career: '' },
        { id: 106, name: '정초이', generation: '27기', techStack: 'IOS', career: '' },
        { id: 107, name: '신성일', generation: '27기', techStack: 'React, Next.js', career: '現 네이버 NTS' },
        { id: 108, name: '박지수', generation: '27기', techStack: '', career: '現 번개장터' },
        { id: 109, name: '김초희', generation: '27기', techStack: 'Android', career: '現 네이버웹툰' },
        { id: 110, name: '김예림', generation: '27기', techStack: 'Java, Spring, e-commerce', career: '現 아이디어스' },
        { id: 111, name: '김성현', generation: '27기', techStack: 'FinTech, Full-Stack', career: '現 나이스피앤아이' },
        { id: 112, name: '김선휘', generation: '27기', techStack: 'Game, Embedded', career: '前 EA코리아 / 前 SSAFY / 現 LG전자' },
        { id: 113, name: '김미성', generation: '27기', techStack: 'ML, AI, Data', career: '現 IBK 기업은행 데이터센터' },
        { id: 114, name: '김건훈', generation: '27기', techStack: 'System, Back-end', career: '前 당근 인턴 / 前 SW마에스트로 / 現 네이버웹툰' },
        { id: 115, name: '현승훈', generation: '26기', techStack: 'Cloud', career: '現 현대오토에버' },
        { id: 116, name: '이혜연', generation: '26기', techStack: 'System', career: '現 삼성생명 시스템 운영팀' },
        { id: 117, name: '표명일', generation: '26기', techStack: 'Data', career: '' },
        { id: 118, name: '조연희', generation: '26기', techStack: 'IOS', career: '現 신한카드' },
        { id: 119, name: '유가희', generation: '26기', techStack: 'Back-end', career: '前 스마일게이트 / 現 네이버웹툰' },
        { id: 120, name: '박주환', generation: '26기', techStack: 'Fintech', career: '' },
        { id: 121, name: '김성규', generation: '26기', techStack: 'Android', career: '現 네이버웹툰' },
        { id: 122, name: '조영진', generation: '25기', techStack: 'Spring, HRIS', career: '現 동원산업' },
        { id: 123, name: '주민기', generation: '25기', techStack: 'FinTech', career: '前 SSAFY / 現 교보생명 금융IT' },
        { id: 124, name: '신준수', generation: '25기', techStack: 'App, Fintech', career: '現 KB국민은행' },
        { id: 125, name: '설주환', generation: '25기', techStack: 'Game', career: '現 스마일게이트' },
        { id: 126, name: '김재완', generation: '25기', techStack: 'Design, PM', career: '現 카카오VX' },
        { id: 127, name: '김지혜', generation: '24기', techStack: 'PM', career: '現 컬리' },
        { id: 128, name: '진상우', generation: '24기', techStack: 'SM, Java, Web, Beck-end', career: '' },
        { id: 129, name: '주현석', generation: '24기', techStack: 'Mobility, Navigation', career: '' },
        { id: 130, name: '윤영주', generation: '24기', techStack: 'Secure', career: '' },
        { id: 131, name: '윤현진', generation: '24기', techStack: 'MES, ERP, Web', career: '現 D&O' },
        { id: 132, name: '황성진', generation: '23기', techStack: 'Cloud, Secure', career: '' },
        { id: 133, name: '양희찬', generation: '23기', techStack: 'System, Back-end', career: '前 삼성전자 인턴 / 前 네이버 / 現 쿠팡' },
        { id: 134, name: '송제민', generation: '23기', techStack: 'Android', career: '前 SSAFY / 前 카카오 인턴 / 現 신한카드' },
        { id: 135, name: '강주호', generation: '23기', techStack: 'Back-end', career: '現 네이버웹툰' },
        { id: 136, name: '남윤제', generation: '22기', techStack: 'React, Front-end', career: '' },
        { id: 137, name: '최세종', generation: '21기', techStack: 'Cloud, Infra', career: '現 삼성전자' },
        { id: 138, name: '김태희', generation: '21기', techStack: 'Cloud, Back-end', career: '現 삼성전자' },
        { id: 139, name: '박성혁', generation: '20기', techStack: 'SW Perfomance, Data', career: '' },
        { id: 140, name: '신지혜', generation: '20기', techStack: 'Web, React', career: '前 삼성 에스원 / 現 카카오' },
        { id: 141, name: '조준확', generation: '19기', techStack: 'Game', career: '現 알트나인' },
        { id: 142, name: '차상균', generation: '15기', techStack: '', career: '前 데브구루' },
        { id: 143, name: '권재영', generation: '15기', techStack: 'HIS', career: '' },
        { id: 144, name: '원평희', generation: '14기', techStack: 'Device Driver, Secure', career: '現 잉카인터넷' },
        { id: 145, name: '송재욱', generation: '14기', techStack: 'Server', career: '前 카카오 / 前 우아한형제들 / 現 라인' },
        { id: 146, name: '김민철', generation: '13기', techStack: 'Web, Qt', career: '' },
        { id: 147, name: '이진호', generation: '11기', techStack: 'Device Driver, C++', career: '現 데브구루' },
        { id: 148, name: '안승례', generation: '11기', techStack: 'Mobile, Web', career: '現 데브구루' },
        { id: 149, name: '최정현', generation: '9기', techStack: 'System, Mobile, Back-end', career: '現 데브구루 연구소장' },
        { id: 150, name: '이주용', generation: '8기', techStack: '', career: '現 LG전자' },
        { id: 151, name: '김종환', generation: '7기', techStack: 'Web, Back-end, API', career: '現 에이치엠솔루션' },
        { id: 152, name: '남윤혁', generation: '5기', techStack: 'Java, Spring, Back-end', career: 'MIS 유지&보수' },
        { id: 153, name: '박동현', generation: '4기', techStack: '', career: '現 한글과컴퓨터 수석연구원' },
        { id: 154, name: '곽중선', generation: '2기', techStack: '', career: '現 한화시스템' },
        { id: 155, name: '김인우', generation: '2기', techStack: '', career: '現 한국하니웰' },
        { id: 156, name: '이봉석', generation: '1기', techStack: '', career: '前 안철수연구소 / 現 하제소프트 대표이사' },
        { id: 157, name: '박창진', generation: '1기', techStack: '', career: '前 도화정보통신 / 現 하제소프트 개발팀장' },
        { id: 158, name: '한형찬', generation: '1기', techStack: '', career: '前 안철수연구소 / 前 마이크로소프트 / 前 하제소프트' },
    ];

    return (
        <div className="members-page">
            <section className="members-hero">
                <div className="container">
                    <h1>구성원</h1>
                    <p>EC의 구성원을 소개합니다.</p>
                </div>
            </section>
            <div className="members-container">
                <div className="section-header">
                    <h1>운영진 소개</h1>
                    <p>Endless Creation을 이끌어가는 임원진을 소개합니다.</p>
                </div>

                {/* President & Vice President (Top 2) */}
                <div className="main-executives">
                    {mainExecutives.map((member) => (
                        <div key={member.id} className="member-card">
                            <div className="image-wrapper">
                                <img src={member.imageUrl} alt={member.name} />
                            </div>
                            <div className="member-info">
                                <h3 className="role">{member.role}</h3>
                                <h2 className="name">{member.name}</h2>
                                <div className="department-info">
                                    <span>{member.department}</span>
                                    <span className="separator">|</span>
                                    <span>{member.studentId}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Other Executives (Remaining 5) */}
                <div className="team-leaders">
                    {teamLeaders.map((member) => (
                        <div key={member.id} className="member-card">
                            <div className="image-wrapper">
                                <img src={member.imageUrl} alt={member.name} />
                            </div>
                            <div className="member-info">
                                <h3 className="role">{member.role}</h3>
                                <h2 className="name">{member.name}</h2>
                                <div className="department-info">
                                    <span>{member.department}</span>
                                    <span className="separator">|</span>
                                    <span>{member.studentId}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="section-divider"></div>

                <div className="section-header">
                    <h1>졸업생 명단</h1>
                    <p>Endless Creation을 빛내주신 졸업생 선배님들입니다.</p>
                    <p style={{ fontSize: '0.9rem', color: '#999', marginTop: '10px' }}>※ 2024년 2월 기준</p>
                </div>

                <div className="graduates-section">
                    {graduates.length > 0 ? (
                        <div className="team-leaders">
                            {graduates.map((member) => (
                                <div key={member.id} className="member-card">
                                    <div className="member-info">
                                        <h3 className="role">{member.generation}</h3>
                                        <h2 className="name">{member.name}</h2>
                                        <div className="department-info" style={{ marginBottom: '4px' }}>
                                            <span>{member.techStack}</span>
                                        </div>
                                        <div className="department-info">
                                            <span>{member.career}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state" style={{ textAlign: 'center', padding: '40px', color: '#666', fontSize: '1.1rem' }}>
                            <p>졸업생 명단이 업데이트 될 예정입니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Members;
