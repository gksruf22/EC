import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import './CheckStatus.css';

const CheckStatus = () => {
    const [searchParams] = useSearchParams();
    const eventId = searchParams.get('eventId');
    const mode = searchParams.get('mode'); // 'first' or 'final'

    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [result, setResult] = useState<{ status: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventId) {
            setError('잘못된 접근입니다. 이벤트 ID가 없습니다.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await api.get('/applications/result', {
                params: { eventId, name, studentId }
            });
            setResult({ status: response.data });
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                setError('지원 내역을 찾을 수 없습니다. 이름과 학번을 확인해주세요.');
            } else {
                setError('조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    const renderResult = () => {
        if (!result) return null;

        const status = result.status;
        let message = '';
        let isPass = false;

        // 1차 합격 조회
        if (mode === 'first') {
            if (status === 'APPROVED' || status === 'PASSED') {
                isPass = true;
                message = '축하합니다! 1차 서류 전형에 합격하셨습니다.';
            } else if (status === 'REJECTED') {
                message = '아쉽게도 이번 서류 전형에 불합격하셨습니다.';
            } else {
                message = '심사가 진행 중입니다.';
            }
        }
        // 최종 합격 조회
        else if (mode === 'final') {
            if (status === 'PASSED') {
                isPass = true;
                message = '축하합니다! 최종 합격하셨습니다.';
            } else if (status === 'REJECTED') {
                message = '아쉽게도 불합격하셨습니다.';
            } else {
                message = '최종 결과 발표 대기 중이거나 서류 전형 단계입니다.';
            }
        } else {
            // 기본 모드 (혹시 모를 경우)
            if (status === 'PASSED') {
                isPass = true;
                message = '축하합니다! 최종 합격하셨습니다.';
            } else if (status === 'APPROVED') {
                isPass = true;
                message = '1차 합격 상태입니다. 최종 심사를 기다려주세요.';
            } else if (status === 'REJECTED') {
                message = '불합격하셨습니다.';
            } else {
                message = '심사 중입니다.';
            }
        }

        return (
            <div className={`result-card ${isPass ? 'pass' : 'fail'}`}>
                <h2>{isPass ? '합격' : '결과 안내'}</h2>
                <p>{message}</p>
                {isPass && mode === 'first' && (
                    <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                        면접 일정 및 세부 사항은 추후 안내될 예정입니다.
                    </p>
                )}
                {isPass && mode === 'final' && (
                    <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                        OT 및 향후 일정은 개별 연락 드릴 예정입니다.
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="check-status-page">
            <section className="check-status-hero">
                <div className="container">
                    <h1>
                        {mode === 'final' ? '최종 합격자 조회' : '1차 합격자 조회'}
                    </h1>
                    <p>지원하신 이름과 학번을 입력하여 결과를 확인해주세요.</p>
                </div>
            </section>

            <div className="check-status-container">
                {!result ? (
                    <form onSubmit={handleSubmit} className="check-status-form">
                        <div className="input-group">
                            <label>이름</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="지원자 성명"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>학번</label>
                            <input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder="학번 (예: 20241234)"
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? '조회 중...' : '조회하기'}
                        </button>
                    </form>
                ) : (
                    <>
                        {renderResult()}
                        <button onClick={() => { setResult(null); setName(''); setStudentId(''); }} className="submit-btn" style={{ marginTop: '20px', background: '#888' }}>
                            다른 사람 조회하기
                        </button>
                    </>
                )}

                {error && <p className="error-message" style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>{error}</p>}

                <Link to="/" className="back-link">
                    메인으로 돌아가기
                </Link>
            </div>
        </div>
    );
};

export default CheckStatus;
