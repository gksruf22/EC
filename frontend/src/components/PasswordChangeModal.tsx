import React, { useState } from 'react';
import api from '../utils/api';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorCode, setErrorCode] = useState<string | null>(null); // 'empty', 'mismatch', 'same', 'fail'

  if (!isOpen) return null;

  const handleSubmit = async () => {
    // Reset error
    setErrorCode(null);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorCode('empty');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorCode('mismatch');
      return;
    }

    if (currentPassword === newPassword) {
      setErrorCode('same');
      return;
    }

    try {
      await api.patch('/members/me/password', {
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      handleClose();
    } catch (error: any) {
      console.error('Password change failed:', error);
      if (error.response && error.response.data) {
         // Backend might return specific error messages
         // For now, generic fail
         setErrorCode('fail');
      } else {
        setErrorCode('fail');
      }
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorCode(null);
    onClose();
  };

  return (
    <div className="modal_w">
      <div className="modal-st1">
        <h3 className="tit-st3">비밀번호 변경</h3>
        <div className="popup_inner">
          <ul className="tablewrite-pw">
            <li>
              <dl>
                <dt>기존 비밀번호</dt>
                <dd>
                  <div className="">
                    <input
                      type="password"
                      className="input-st1"
                      title="기존 비밀번호"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                </dd>
              </dl>
            </li>
          </ul>
          <ul className="tablewrite-newpw type2" style={{ borderTop: 0 }}>
            <li>
              <dl>
                <dt>새 비밀번호</dt>
                <dd>
                  <div className="">
                    <input
                      type="password"
                      className="input-st1"
                      title="새 비밀번호"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>새 비밀번호 확인</dt>
                <dd>
                  <div className="">
                    <input
                      type="password"
                      className="input-st1"
                      title="새 비밀번호 확인"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </dd>
              </dl>
            </li>
          </ul>

          {errorCode === 'empty' && (
            <p className="color-red mt15">비밀번호를 모두 입력해주세요.</p>
          )}
          {errorCode === 'fail' && (
            <p className="color-red mt15">비밀번호가 맞지 않습니다. 다시 입력해주세요.</p>
          )}
          {errorCode === 'mismatch' && (
            <p className="color-red mt15">새 비밀번호가 맞지 않습니다. 다시 확인해주세요.</p>
          )}
          {errorCode === 'same' && (
            <p className="color-red mt15">기존 비밀번호 입니다. 다시 입력해주세요.</p>
          )}

          <div className="btn_w-st1 mt50">
            <button
              type="button"
              className="btn-st1 bg-black_r"
              onClick={handleClose}
            >
              취소
            </button>
            <button
              type="button"
              className="btn-st1 bg-green"
              title="비밀번호 변경하기"
              onClick={handleSubmit}
            >
              비밀번호 변경하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
