import clsx from 'clsx';
import styles from './CustomToast.module.css';

export function CustomToast({ show, message, type = 'warning' }) {
  return (
    <div className={styles.toastContainer}>
      <p
        className={clsx({
          [styles.toastWarning]: type === 'warning',
          [styles.toastShare]: type === 'share',
          [styles.show]: show,
        })}
      >
        {message}
      </p>
    </div>
  );
}
