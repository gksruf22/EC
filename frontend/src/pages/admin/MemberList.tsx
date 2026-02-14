import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../../utils/api';
import MemberDetailModal from './MemberDetailModal';
import './MemberList.css';

export interface Member {
    id: number;
    name: string;
    studentId: string;
    department: string;
    email: string;
    phoneNumber: string;
    role: string;
    generation: number;
}

const MemberList: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/members');
            setMembers(response.data);
        } catch (err) {
            console.error("회원 목록 로드 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredMembers = members.filter(member =>
        member.name.includes(searchTerm) ||
        member.studentId.includes(searchTerm) ||
        member.department?.includes(searchTerm)
    );

    const handleMemberClick = (member: Member) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMember(null);
    };

    const handleUpdateMember = async (updatedMember: Member) => {
        try {
            await api.put(`/members/${updatedMember.id}`, updatedMember);

            setMembers(prevMembers =>
                prevMembers.map(m => m.id === updatedMember.id ? updatedMember : m)
            );
            alert('회원 정보가 수정되었습니다.');
            handleCloseModal();
        } catch (err) {
            console.error("회원 정보 수정 실패:", err);
            alert('회원 정보 수정에 실패했습니다.');
        }
    };

    return (
        <div className="member-list-page">
            <div className="list-header">
                <h1>전체 회원 관리 <span className="count">{members.length}명</span></h1>
            </div>

            <div className="list-toolbar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="이름, 학번, 학과 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="member-table">
                    <thead>
                        <tr>
                            <th>이름</th>
                            <th>학번</th>
                            <th>연락처</th>
                            <th>이메일</th>
                            <th>권한</th>
                        </tr>
                    </thead>
                    <tbody style={{ cursor: 'pointer' }}>
                        {loading ? (
                            <tr><td colSpan={6} className="text-center p-8">데이터를 불러오는 중...</td></tr>
                        ) : filteredMembers.length === 0 ? (
                            <tr><td colSpan={6} className="no-results">조건에 맞는 회원이 없습니다.</td></tr>
                        ) : (
                            filteredMembers.map((member) => (
                                <tr key={member.id} onClick={() => handleMemberClick(member)} className="cursor-pointer hover:bg-gray-50">
                                    <td className="user-info">
                                        <div className="flex items-center gap-2">
                                            {member.name}
                                        </div>
                                    </td>
                                    <td>{member.studentId}</td>
                                    <td className="user-contact">
                                        <div className="flex items-center gap-2">
                                            {member.phoneNumber}
                                        </div>
                                    </td>
                                    <td className="user-contact">
                                        <div className="flex items-center gap-2">
                                            {member.email}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${member.role === 'ROLE_ADMIN' ? 'admin' : ''}`}>
                                            {member.role === 'ROLE_ADMIN' ? '관리자' : '일반 회원'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <MemberDetailModal
                isOpen={isModalOpen}
                member={selectedMember}
                onClose={handleCloseModal}
                onUpdate={handleUpdateMember}
            />
        </div>
    );
};

export default MemberList;
