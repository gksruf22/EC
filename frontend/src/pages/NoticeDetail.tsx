import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Notice.css'; // Reuse existing styles

interface Notice {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

const NoticeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [notice, setNotice] = useState<Notice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await api.get(`/notices/${id}`);
                setNotice(response.data);
            } catch (err) {
                console.error("Failed to fetch notice", err);
                setError("공지사항을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNotice();
        }
    }, [id]);

    if (loading) return <div className="notice-container" style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    if (error) return <div className="notice-container" style={{ textAlign: 'center', padding: '50px' }}>{error}</div>;
    if (!notice) return <div className="notice-container" style={{ textAlign: 'center', padding: '50px' }}>공지사항을 찾을 수 없습니다.</div>;

    return (
        <div className="notice-page">
            <div className="notice-container detail-view" style={{ marginTop: '100px' }}>
                <button className="back-btn" onClick={() => navigate('/notice')}>← 목록으로</button>
                <h1>{notice.title}</h1>

                <div className="info-grid">
                    <div className="info-item">
                        <strong>작성일</strong>
                        <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="detail-content">
                    <h3>설명</h3>
                    <p style={{ whiteSpace: 'pre-line' }}>{notice.content}</p>
                </div>
            </div>
        </div>
    );
};

export default NoticeDetail;
