import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import type { Member } from './MemberList';
import './MemberDetailModal.css';

interface MemberDetailModalProps {
    isOpen: boolean;
    member: Member | null;
    onClose: () => void;
    onUpdate: (updatedMember: Member) => Promise<void>;
}

const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
    isOpen,
    member,
    onClose,
    onUpdate
}) => {
    const [formData, setFormData] = useState<Member | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (member) {
            setFormData({ ...member });
        }
    }, [member]);

    if (!isOpen || !formData) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'phoneNumber') {
            const numbers = value.replace(/\D/g, '');
            let formatted = numbers;
            if (numbers.length >= 4 && numbers.length < 8) {
                formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
            } else if (numbers.length >= 8) {
                formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
            }
            setFormData(prev => prev ? { ...prev, [name]: formatted } : null);
            return;
        }

        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        try {
            setIsSubmitting(true);
            await onUpdate(formData);
        } catch (error) {
            console.error("Update failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Close on overlay click
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2>회원 정보 수정</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>이름</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>학번</label>
                            <input
                                type="text"
                                name="studentId"
                                value={formData.studentId}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>이메일</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>전화번호</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="010-0000-0000(숫자만 입력해주세요)"
                                maxLength={13}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>권한</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="ROLE_MEMBER">일반 회원</option>
                                <option value="ROLE_ADMIN">관리자</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            취소
                        </button>
                        <button type="submit" className="save-btn" disabled={isSubmitting}>
                            <Save size={16} />
                            {isSubmitting ? '저장 중...' : '저장'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MemberDetailModal;
