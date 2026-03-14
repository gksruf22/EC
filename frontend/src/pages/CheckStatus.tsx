import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './CheckStatus.css';

const CheckStatus = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const eventId = searchParams.get('eventId');

    // mode 판별: 'mode' 파라미터가 있으면 우선 사용하고, 없으면 기존 링크 호환을 위해 'final' 혹은 'first' 파라미터를 확인
    let mode = searchParams.get('mode');
    if (!mode) {
        if (searchParams.get('final')) mode = searchParams.get('final');
        else if (searchParams.get('first')) mode = searchParams.get('first');
    }

    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [result, setResult] = useState<{ status: string; interviewLink?: string } | null>(null);
    const [loading, setLoading] = useState(false);

    // 설정 관련 상태 추가
    const [isCheckingSettings, setIsCheckingSettings] = useState(true);

    React.useEffect(() => {
        const checkSettings = async () => {
            if (!eventId || !mode) {
                setIsCheckingSettings(false);
                return;
            }

            try {
                const res = await api.get(`/admin/pass-fail-settings?eventId=${eventId}&mode=${mode}`);
                const settings = res.data;

                if (!settings || !settings.isActive) {
                    alert('현재 합격자 조회 기간이 아닙니다.');
                    navigate('/');
                } else {
                    const now = new Date();
                    const start = settings.startDate ? new Date(settings.startDate) : null;
                    const end = settings.endDate ? new Date(settings.endDate) : null;

                    if (start && now < start) {
                        alert('현재 합격자 조회 기간이 아닙니다.');
                        navigate('/');
                    } else if (end && now > end) {
                        alert('현재 합격자 조회 기간이 아닙니다.');
                        navigate('/');
                    }
                }
            } catch (err) {
                console.error('설정 확인 실패:', err);
                alert('설정 정보를 불러오는데 실패했습니다.');
                navigate('/');
            } finally {
                setIsCheckingSettings(false);
            }
        };

        checkSettings();
    }, [eventId, mode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventId) {
            alert('잘못된 접근입니다. 이벤트 ID가 없습니다.');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await api.get('/applications/result', {
                params: { eventId, mode, name, studentId }
            });
            setResult(response.data);
        } catch (err: any) {
            let errorMsg = '조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            if (err.response && err.response.data) {
                errorMsg = typeof err.response.data === 'string' ? err.response.data : errorMsg;
            }
            alert(errorMsg);
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
                message = '아쉽게도 이번 모집에 불합격하셨습니다.';
            } else {
                message = '최종 결과 발표 대기 중입니다. 관리자에게 문의해주세요.';
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
                    <div className="first-pass-info">
                        <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                            아래 링크에서 면접 일정을 입력해주세요.
                        </p>
                        {result.interviewLink && (
                            <a
                                href={result.interviewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="interview-link-btn"
                                style={{
                                    display: 'inline-block',
                                    marginTop: '15px',
                                    padding: '10px 20px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '5px',
                                    fontWeight: 'bold'
                                }}
                            >
                                면접 시간 선택하기
                            </a>
                        )}
                    </div>
                )}
                {isPass && mode === 'final' && (
                    <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                        향후 일정은 추후 공지될 예정입니다.
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
                {isCheckingSettings ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>설정 정보를 확인 중입니다...</div>
                ) : !result ? (
                    <form onSubmit={handleSubmit} className="check-status-form">
                        <div className="input-group">
                            <label>이름</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="홍길동"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>학번</label>
                            <input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder="26100000"
                                required
                            />
                        </div>
                        <button type="submit" className="check-status-submit-btn" disabled={loading}>
                            {loading ? '조회 중...' : '조회하기'}
                        </button>
                    </form>
                ) : (
                    <>
                        {renderResult()}
                        <Link to="/" className="check-status-submit-btn">
                            메인화면으로 돌아가기
                        </Link>
                    </>
                )}

            </div>
        </div>
    );
};

export default CheckStatus;
