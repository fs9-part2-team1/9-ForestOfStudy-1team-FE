import styles from './CustomToast.module.css';

export function CustomToast({ show, message, type = 'warning' }) {
  // type: 'warning' | 'share'
  return (
    <div className={styles.toastContainer}>
      <p
        className={`${type === 'warning' ? styles.toastWarning : styles.toastShare} ${
          show ? styles.show : ''
        }`}
      >
        {message}
      </p>
    </div>
  );
}
