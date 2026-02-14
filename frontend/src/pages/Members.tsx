import './Members.css';

interface Member {
    id: number;
    name: string;
    role: string;
    department: string;
    studentId: string; // e.g. 21학번
    imageUrl: string;
}

const Members = () => {
    const executives: Member[] = [
        {
            id: 1,
            name: '신우빈',
            role: '회장',
            department: '컴퓨터공학과',
            studentId: '25학번',
            imageUrl: 'https://via.placeholder.com/150?text=President',
        },
        {
            id: 2,
            name: '김경태',
            role: '부회장',
            department: '컴퓨터공학과',
            studentId: '22학번',
            imageUrl: 'https://via.placeholder.com/150?text=Vice+President',
        },
        {
            id: 3,
            name: '이재훈',
            role: '학술부장',
            department: '컴퓨터공학과',
            studentId: '22학번',
            imageUrl: 'https://via.placeholder.com/150?text=Academic',
        },
        {
            id: 4,
            name: '박관호',
            role: '홍보부장',
            department: '컴퓨터공학과',
            studentId: '25학번',
            imageUrl: 'https://via.placeholder.com/150?text=Promotion',
        },
        {
            id: 5,
            name: '김채영',
            role: '기획부장',
            department: '컴퓨터공학과',
            studentId: '25학번',
            imageUrl: 'https://via.placeholder.com/150?text=Planning',
        },
        {
            id: 6,
            name: '조한결',
            role: '인사부장',
            department: '컴퓨터공학과',
            studentId: '25학번',
            imageUrl: 'https://via.placeholder.com/150?text=Admin',
        },
        {
            id: 7,
            name: '이준석',
            role: '재무부장',
            department: '컴퓨터공학과',
            studentId: '25학번',
            imageUrl: 'https://via.placeholder.com/150?text=Finance',
        },
    ];

    const mainExecutives = executives.slice(0, 2);
    const teamLeaders = executives.slice(2);

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

                { /* 이후 추가 예정
                <div className="section-divider"></div>

                <div className="section-header">
                    <h1>EC 멤버</h1>
                    <p>이후 추가 예정입니다.</p>
                </div>
                */}
            </div>
        </div>
    );
};

export default Members;
