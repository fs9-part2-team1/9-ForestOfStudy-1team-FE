import React from "react";
import styles from "./Modal.module.css";

export default function Modal({ isOpen, onClose, title, buttonText = "확인", children }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.message}>{children}</div>
        <div className={styles.btnBox}>
          <button onClick={onClose} className={styles.closeBtn}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
