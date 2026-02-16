import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './Notice.css';

interface Notice {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

const Notice = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [step, setStep] = useState<'list' | 'detail'>('list');
    const [selectedItem, setSelectedItem] = useState<Notice | null>(null);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await api.get('/notices');
            // Sort by ID descending (newest first) if the backend doesn't already
            const sortedNotices = response.data.sort((a: Notice, b: Notice) => b.id - a.id);
            setNotices(sortedNotices);
        } catch (err) {
            console.error("Failed to fetch notices", err);
        }
    };

    const handleNoticeClick = (notice: Notice) => {
        setSelectedItem(notice);
        setStep('detail');
    };

    return (
        <div className="notice-page">
            {step === 'list' && (
                <>
                    <section className="notice-hero">
                        <div className="container">
                            <h1>공지사항</h1>
                            <p>Endless Creation의 새로운 소식을 확인하세요.</p>
                        </div>
                    </section>

                    <div className="notice-table-container">
                        <table className="notice-table">
                            <thead>
                                <tr>
                                    <th className="notice-th-title">제목</th>
                                    <th className="notice-th-date">작성일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notices.length > 0 ? (
                                    notices.map((notice) => (
                                        <tr
                                            key={notice.id}
                                            className="notice-row"
                                            onClick={() => handleNoticeClick(notice)}
                                        >
                                            <td className="td-title">
                                                {notice.title}
                                            </td>
                                            <td className="td-date">{new Date(notice.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="no-notices">
                                            등록된 공지사항이 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {step === 'detail' && selectedItem && (
                <div className="notice-container detail-view">
                    <button className="back-btn" onClick={() => setStep('list')}>← 목록으로</button>
                    <h1>{selectedItem.title}</h1>

                    <div className="info-grid">
                        <div className="info-item">
                            <strong>작성일</strong>
                            <span>{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="detail-content">
                        <p style={{ whiteSpace: 'pre-line' }}>{selectedItem.content}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Notice;
