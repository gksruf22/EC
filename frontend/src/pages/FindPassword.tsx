import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Signup.css'; // Reuse Signup styles

const FindPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);

    const handleRequestCode = async () => {
        if (!email) {
            setError('이메일을 입력해주세요.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post(`/members/password-reset/request?email=${encodeURIComponent(email)}`);
            alert('인증 코드가 이메일로 발송되었습니다.');
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data || '인증 코드 발송에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!code) {
            setError('인증 코드를 입력해주세요.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post(`/members/email-verification/verify?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
            setStep(3);
        } catch (err: any) {
            setError(err.response?.data || '인증 코드가 올바르지 않습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('비밀번호는 8자 이상이어야 하며, 영문, 숫자, 특수문자(@$!%*#?&)를 모두 포함해야 합니다.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.post('/members/password-reset/confirm', {
                email,
                newPassword: password
            });
            alert('비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.');
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data || '비밀번호 변경에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val);
        if (confirmPassword) setPasswordMatch(val === confirmPassword);
    };

    const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setConfirmPassword(val);
        if (password) setPasswordMatch(password === val);
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h1>비밀번호 찾기</h1>

                {step === 1 && (
                    <>
                        <div className="form-group">
                            <label htmlFor="email">이메일</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="가입한 이메일 입력"
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <button onClick={handleRequestCode} className="signup-submit-btn" disabled={loading}>
                            {loading ? '발송 중...' : '인증 번호 받기'}
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="form-group">
                            <label htmlFor="code">인증 번호</label>
                            <input
                                type="text"
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="인증 번호 입력"
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <button onClick={handleVerifyCode} className="signup-submit-btn" disabled={loading}>
                            {loading ? '확인 중...' : '인증 확인'}
                        </button>
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                            <button
                                onClick={() => setStep(1)}
                                style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>
                                이메일 다시 입력하기
                            </button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <div className="form-group">
                            <label htmlFor="password">
                                새 비밀번호
                                <span className="password-requirements"> (8자 이상, 영문/숫자/특수문자 포함)</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="8자 이상, 영문/숫자/특수문자 포함"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                새 비밀번호 확인
                                {passwordMatch === false && <span className="password-error">불일치</span>}
                                {passwordMatch === true && <span className="password-match">일치</span>}
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={handleConfirmChange}
                                placeholder="비밀번호 재입력"
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <button onClick={handlePasswordReset} className="signup-submit-btn" disabled={loading}>
                            {loading ? '변경 중...' : '비밀번호 변경'}
                        </button>
                    </>
                )}

                <div className="login-link">
                    <a href="/login">로그인으로 돌아가기</a>
                </div>
            </div>
        </div>
    );
};

export default FindPassword;
