import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    emailCode: '',
    password: '',
    confirmPassword: '',
    name: '',
    studentId: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  
  // 이메일 인증 관련 상태
  const [emailSending, setEmailSending] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSendEmailCode = async () => {
    if (!formData.email) {
      setEmailError('이메일을 입력해주세요.');
      return;
    }
    if (!formData.email.endsWith('@seoultech.ac.kr')) {
      setEmailError('잘못된 이메일 형식입니다.');
      return;
    }

    setEmailSending(true);
    setError('');
    setEmailError(null);

    try {
      await api.post(`/members/email-verification/request?email=${encodeURIComponent(formData.email)}`);
      setIsEmailSent(true);
      alert('인증 코드가 이메일로 발송되었습니다. (5분 내 입력해주세요)');
    } catch (err: any) {
      const errorMsg = err.response?.data || '인증 코드 발송에 실패했습니다.';
      if (errorMsg.includes('이미 가입된 이메일')) {
        setEmailError('이미 가입된 이메일입니다.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setEmailSending(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    if (!formData.emailCode) {
      setError('인증 코드를 입력해주세요.');
      return;
    }

    setEmailVerifying(true);
    setError('');

    try {
      const normalizedCode = encodeURIComponent(formData.emailCode.trim());
      await api.post(`/members/email-verification/verify?email=${encodeURIComponent(formData.email)}&code=${normalizedCode}`);
      setIsEmailVerified(true);
      alert('이메일 인증이 완료되었습니다!');
    } catch (err: any) {
      setError(err.response?.data || '인증 코드가 일치하지 않습니다.');
    } finally {
      setEmailVerifying(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 이메일 입력 시 에러 초기화 및 인증 상태 리셋
    if (name === 'email') {
      setEmailError(null);
      setIsEmailSent(false);
      setIsEmailVerified(false);
      setFormData(prev => ({
        ...prev,
        email: value,
        emailCode: ''
      }));
      setError('');
      return; 
    }

    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
    
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMatch(null);
    }
  };

  const handlePasswordBlur = () => {
    if (formData.password && formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    }
  };

  const validateForm = () => {
    if (!formData.email.endsWith('@seoultech.ac.kr')) {
      setError('서울과학기술대학교 이메일(@seoultech.ac.kr)로만 가입 가능합니다.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    if (!formData.name || !formData.studentId || !formData.phoneNumber) {
      setError('모든 필드를 입력해주세요.');
      return false;
    }
    if (!isEmailVerified) {
      setError('이메일 인증을 완료해주세요.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const signupData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        studentId: formData.studentId,
        phoneNumber: formData.phoneNumber,
      };

      const response = await api.post('/members/signup', signupData);
      console.log('회원가입 성공, ID:', response.data);
      
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>회원가입</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              이메일
              {emailError && <span className="email-error">{emailError}</span>}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@seoultech.ac.kr"
              className={emailError ? 'input-error' : ''}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="emailCode">
              이메일 인증
              {isEmailVerified && <span className="verified-badge"> ✓ 인증완료</span>}
            </label>
            <div className="input-with-button">
              <input
                type="text"
                id="emailCode"
                name="emailCode"
                value={formData.emailCode}
                onChange={handleChange}
                placeholder="인증 번호 입력"
                disabled={isEmailVerified}
              />
              {!isEmailSent ? (
                <button 
                  type="button" 
                  className="verify-btn" 
                  onClick={handleSendEmailCode}
                  disabled={emailSending || isEmailVerified}
                >
                  {emailSending ? '발송 중...' : '인증 번호 받기'}
                </button>
              ) : !isEmailVerified ? (
                <>
                  <button 
                    type="button" 
                    className="verify-btn confirm-btn" 
                    onClick={handleVerifyEmailCode}
                    disabled={emailVerifying}
                  >
                    {emailVerifying ? '확인 중...' : '인증 확인'}
                  </button>
                  <button 
                    type="button" 
                    className="verify-btn resend-btn" 
                    onClick={handleSendEmailCode}
                    disabled={emailSending}
                  >
                    재발송
                  </button>
                </>
              ) : null}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handlePasswordBlur}
              placeholder="최소 6자 이상"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              비밀번호 확인
              {passwordMatch === false && (
                <span className="password-error">비밀번호가 일치하지 않습니다</span>
              )}
              {passwordMatch === true && (
                <span className="password-match">비밀번호가 일치합니다</span>
              )}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handlePasswordBlur}
              placeholder="비밀번호 재입력"
              className={passwordMatch === false ? 'input-error' : ''}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="홍길동"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="studentId">학번</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="20000000"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">전화번호</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="010-1234-5678"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '처리 중...' : '회원가입'}
          </button>
        </form>

        <div className="login-link">
          이미 계정이 있으신가요? <a href="/login">로그인</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
