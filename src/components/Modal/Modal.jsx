import React from 'react';
import styles from './Modal.module.css';

export default function Modal({
  isOpen,
  onClose,
  title,
  buttonText = '확인',
  onConfirm,
  children,
  modalClassName,
  titleClassName,
  btnClassName,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${modalClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={`${styles.title} ${titleClassName}`}>{title}</h3>
        <div className={styles.message}>{children}</div>
        <div className={styles.btnBox}>
          <button
            onClick={onConfirm || onClose}
            className={`${styles.closeBtn} ${btnClassName}`}
          >
            {buttonText}
          </button>
          {/* 화면이 max-width: 743px일 때 나타남 */}
          <button
            onClick={onClose}
            className={`${styles.editCloseBtn} ${styles.mobileCloseBtn}`}
          >
            나가기
          </button>
        </div>
      </div>
    </div>
  );
}
