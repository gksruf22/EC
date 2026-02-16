import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, X, Save } from 'lucide-react';
import api from '../../utils/api';
import './NoticeManagement.css';

interface Notice {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

const NoticeManagement: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
    const [formData, setFormData] = useState({ title: '', content: '' });

    // 1. 공지사항 데이터 불러오기
    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await api.get('/notices');
            setNotices(response.data);
        } catch (err) {
            console.error("데이터를 불러오지 못했습니다.", err);
        }
    };

    // Modal Handlers
    const handleOpenCreateModal = () => {
        setEditingNotice(null);
        setFormData({ title: '', content: '' });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (notice: Notice) => {
        setEditingNotice(notice);
        setFormData({ title: notice.title, content: notice.content || '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingNotice(null);
        setFormData({ title: '', content: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Handle Submit Called. EditingNotice:", editingNotice);
        try {
            if (editingNotice) {
                // Edit
                console.log("Sending PUT request to:", `/admin/notices/${editingNotice.id}`);
                await api.put(`/admin/notices/${editingNotice.id}`, formData);
                alert("공지사항이 수정되었습니다.");
            } else {
                // Create
                console.log("Sending POST request to: /admin/notices");
                await api.post('/admin/notices', formData);
                alert("공지사항이 등록되었습니다.");
            }
            fetchNotices();
            handleCloseModal();
        } catch (err) {
            console.error("저장 실패:", err);
            alert("공지사항 저장에 실패했습니다.");
        }
    };

    // 공지사항 삭제
    const handleDelete = async (id: number) => {
        if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
            try {
                await api.delete(`/admin/notices/${id}`);
                setNotices(notices.filter(n => n.id !== id));
            } catch (err) {
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="admin-notice-manage-page">
            <div className="admin-list-header">
                <h1>공지사항 관리</h1>
            </div>

            <div className="admin-notice-toolbar">
                <div className="admin-search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="공지사항 제목 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="add-btn" onClick={handleOpenCreateModal}>
                    <Plus size={20} /> 새 공지 등록
                </button>
            </div>

            <div className="admin-notice-table-container">
                <table className="admin-notice-table">
                    <thead>
                        <tr>
                            <th className="admin-notice-th-id">ID</th>
                            <th className="admin-notice-th-title">제목</th>
                            <th className="admin-notice-th-date">작성일</th>
                            <th className="admin-notice-th-manage">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notices
                            .filter(n => n.title.includes(searchTerm))
                            .map((notice) => (
                                <tr key={notice.id}>
                                    <td className="admin-notice-td-id">{notice.id}</td>
                                    <td className="admin-notice-td-title">{notice.title}</td>
                                    <td className="admin-notice-td-date">{new Date(notice.createdAt).toLocaleDateString()}</td>
                                    <td className="admin-notice-td-manage">
                                        <button className="icon-btn edit" title="수정" onClick={() => handleOpenEditModal(notice)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="icon-btn delete" title="삭제" onClick={() => handleDelete(notice.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {
                isModalOpen && (
                    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}>
                        <div className="modal-container">
                            <div className="modal-header">
                                <h2>{editingNotice ? '공지사항 수정' : '새 공지사항 등록'}</h2>
                                <button className="close-btn" onClick={handleCloseModal}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>제목</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            placeholder="공지사항 제목을 입력하세요"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>내용</label>
                                        <textarea
                                            className="content-textarea"
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            required
                                            placeholder="공지사항 내용을 입력하세요"
                                            rows={10}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="cancel-btn" onClick={handleCloseModal}>취소</button>
                                    <button type="submit" className="save-btn">
                                        <Save size={16} /> 저장
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default NoticeManagement;