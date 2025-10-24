import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components';
import { CustomToast } from '@/components/CustomToast/CustomToast';
import eyeOff from '@/assets/icons/password/btn_visibility_off.png';
import eyeOn from '@/assets/icons/password/btn_visibility_on.png';
import styles from './EditStudyModal.module.css';

export default function EditStudyBtn({
  buttonText,
  confirmText,
  nickname,
  title,
  password,
  btnClassName,
  redirectTo,
  onDelete,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [inputPw, setInputPw] = useState('');
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleToggle = () => setShowPw((prev) => !prev);

  const handleConfirm = () => {
    if (inputPw === password) {
      if (onDelete) {
        onDelete();
        navigate('/');
      } else if (redirectTo) {
        navigate(redirectTo);
      }
      setIsOpen(false);
    } else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };
  return (
    <>
      <button className={btnClassName} onClick={handleOpen}>
        {buttonText}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={`${nickname}의 ${title}`}
        buttonText={confirmText}
        modalClassName={styles.editModalSize}
        titleClassName={styles.editModalTitle}
        btnClassName={styles.editModalBtn}
        onConfirm={handleConfirm}
      >
        <div className={styles.modalContainer}>
          <button className={styles.exitBtn} onClick={handleClose}>
            나가기
          </button>

          <p className={styles.description}>권한이 필요해요!</p>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="edit-Pw">
              비밀번호
            </label>
            <input
              id="edit-Pw"
              type={showPw ? 'text' : 'password'}
              className={styles.pwInput}
              placeholder="비밀번호를 입력해 주세요"
              value={inputPw}
              onChange={(e) => setInputPw(e.target.value)}
            />
            <img
              className={styles.eyesIcon}
              src={showPw ? eyeOn : eyeOff}
              alt={showPw ? '비밀번호 보기' : '비밀번호 숨기기'}
              onClick={handleToggle}
            />
          </div>
        </div>
      </Modal>

      {showToast && (
        <CustomToast
          show={showToast}
          message="🚨 비밀번호가 일치하지 않습니다. 다시 입력해주세요."
          type="warning"
        />
      )}
    </>
  );
}
